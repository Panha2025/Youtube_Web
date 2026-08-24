<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use RuntimeException;

class YoutubeVideoService
{
    private const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';
    private const CACHE_SECONDS = 300;
    private const ALL_VIDEOS_CACHE_SECONDS = 3600;
    private const DEFAULT_THUMBNAIL = '/placeholder-recipe.svg';

    private array $categoryKeywordMap = [
        'Chicken' => ['chicken', 'hen', 'wings', 'drumstick'],
        'Pork' => ['pork', 'bacon', 'rib', 'ham'],
        'Beef' => ['beef', 'steak', 'oxtail'],
        'Seafood' => ['fish', 'shrimp', 'crab', 'seafood', 'prawn', 'squid', 'salmon', 'tuna'],
        'Soup' => ['soup', 'broth', 'stew', 'curry'],
        'Rice' => ['rice', 'fried rice', 'porridge', 'congee'],
        'Noodles' => ['noodle', 'noodles', 'pasta', 'mee', 'ramen'],
        'Dessert' => ['cake', 'dessert', 'sweet', 'cookie', 'pudding', 'ice cream'],
        'Drinks' => ['coffee', 'juice', 'drink', 'tea', 'smoothie', 'milk'],
        'Snacks' => ['snack', 'chips', 'fries', 'spring roll', 'appetizer'],
        'Khmer Food' => ['khmer', 'cambodian', 'cambodia', 'ប្រហុក', 'អាម៉ុក', 'ខ្មែរ'],
    ];

    public function videosPage(?string $pageToken = null, bool $refresh = false): array
    {
        $cacheKey = 'youtube_videos_page_'.md5((string) $pageToken);

        if ($refresh) {
            Cache::forget($cacheKey);
        }

        return Cache::remember($cacheKey, self::CACHE_SECONDS, function () use ($pageToken) {
            $playlistId = $this->uploadsPlaylistId();
            $data = $this->youtubeGet('playlistItems', [
                'part' => 'snippet,contentDetails',
                'maxResults' => '50',
                'playlistId' => $playlistId,
                ...($pageToken ? ['pageToken' => $pageToken] : []),
            ]);

            $items = collect($data['items'] ?? [])
                ->filter(fn (array $item) => data_get($item, 'snippet.resourceId.videoId') && data_get($item, 'snippet.title') !== 'Private video')
                ->values();

            $details = $this->videoDetails($items->pluck('snippet.resourceId.videoId')->all());

            return [
                'videos' => $items
                    ->map(fn (array $item) => $this->mapPlaylistItem($item, $details[data_get($item, 'snippet.resourceId.videoId')] ?? null))
                    ->all(),
                'nextPageToken' => $data['nextPageToken'] ?? null,
            ];
        });
    }

    public function allVideos(int $maxPages = 12, bool $refresh = false): array
    {
        $cacheKey = 'youtube_all_videos';

        if ($refresh) {
            Cache::forget($cacheKey);
        }

        return Cache::remember($cacheKey, self::ALL_VIDEOS_CACHE_SECONDS, function () use ($maxPages, $refresh) {
            $videos = [];
            $nextPageToken = null;

            for ($page = 0; $page < $maxPages; $page++) {
                $result = $this->videosPage($nextPageToken, $refresh);
                $videos = [...$videos, ...$result['videos']];

                if (empty($result['nextPageToken'])) {
                    break;
                }

                $nextPageToken = $result['nextPageToken'];
            }

            return $videos;
        });
    }

    public function findVideo(string $videoId): ?array
    {
        return collect($this->allVideos())->firstWhere('id', $videoId);
    }

    private function uploadsPlaylistId(): string
    {
        $configuredPlaylistId = env('YOUTUBE_UPLOADS_PLAYLIST_ID');

        if ($configuredPlaylistId) {
            return $configuredPlaylistId;
        }

        $channelId = env('YOUTUBE_CHANNEL_ID');

        if (!$channelId) {
            throw new RuntimeException('Missing YOUTUBE_CHANNEL_ID in Laravel .env file.');
        }

        $data = $this->youtubeGet('channels', [
            'part' => 'contentDetails',
            'id' => $channelId,
        ]);

        $uploadsPlaylistId = data_get($data, 'items.0.contentDetails.relatedPlaylists.uploads');

        if (!$uploadsPlaylistId) {
            throw new RuntimeException('Could not find an uploads playlist for this channel.');
        }

        return $uploadsPlaylistId;
    }

    private function videoDetails(array $videoIds): array
    {
        if ($videoIds === []) {
            return [];
        }

        $data = $this->youtubeGet('videos', [
            'part' => 'statistics,contentDetails',
            'id' => implode(',', $videoIds),
        ]);

        return collect($data['items'] ?? [])
            ->mapWithKeys(fn (array $item) => [
                $item['id'] => [
                    'viewCount' => (int) data_get($item, 'statistics.viewCount', 0),
                    'duration' => data_get($item, 'contentDetails.duration'),
                ],
            ])
            ->all();
    }

    private function youtubeGet(string $path, array $params): array
    {
        $apiKey = env('YOUTUBE_API_KEY');

        if (!$apiKey) {
            throw new RuntimeException('Missing YOUTUBE_API_KEY in Laravel .env file.');
        }

        $request = Http::timeout(20);

        if (!filter_var(env('YOUTUBE_VERIFY_SSL', true), FILTER_VALIDATE_BOOLEAN)) {
            $request = $request->withoutVerifying();
        }

        $response = $request->get(self::YOUTUBE_API_BASE.'/'.$path, [
            ...$params,
            'key' => $apiKey,
        ]);

        if ($response->failed()) {
            throw new RuntimeException($response->json('error.message') ?: 'YouTube API request failed.');
        }

        return $response->json();
    }

    private function mapPlaylistItem(array $item, ?array $details): array
    {
        $title = data_get($item, 'snippet.title', '');
        $description = data_get($item, 'snippet.description', '');
        $id = data_get($item, 'snippet.resourceId.videoId');

        return [
            'id' => $id,
            'title' => $title,
            'description' => $description,
            'shortDescription' => $this->truncateText($description),
            'thumbnail' => $this->chooseThumbnail(data_get($item, 'snippet.thumbnails', [])),
            'publishedAt' => data_get($item, 'snippet.publishedAt'),
            'youtubeUrl' => "https://www.youtube.com/watch?v={$id}",
            'category' => $this->categorizeVideo($title, $description),
            'viewCount' => $details['viewCount'] ?? 0,
            'duration' => $details['duration'] ?? null,
        ];
    }

    private function chooseThumbnail(array $thumbnails): string
    {
        return data_get($thumbnails, 'maxres.url')
            ?: data_get($thumbnails, 'standard.url')
            ?: data_get($thumbnails, 'high.url')
            ?: data_get($thumbnails, 'medium.url')
            ?: data_get($thumbnails, 'default.url')
            ?: self::DEFAULT_THUMBNAIL;
    }

    private function categorizeVideo(string $title, string $description): string
    {
        $searchableText = mb_strtolower($title.' '.$description);

        foreach ($this->categoryKeywordMap as $category => $keywords) {
            foreach ($keywords as $keyword) {
                if (str_contains($searchableText, mb_strtolower($keyword))) {
                    return $category;
                }
            }
        }

        return 'Other';
    }

    private function truncateText(string $text, int $maxLength = 150): string
    {
        $cleanText = trim(preg_replace('/\s+/', ' ', $text) ?: '');

        if ($cleanText === '') {
            return 'Watch this recipe video for the full ingredients, cooking steps, and serving ideas.';
        }

        if (mb_strlen($cleanText) <= $maxLength) {
            return $cleanText;
        }

        return trim(mb_substr($cleanText, 0, $maxLength)).'...';
    }
}

<?php

namespace App\Http\Controllers;

use App\Services\YoutubeVideoService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Throwable;

class YoutubeVideoController extends Controller
{
    public function __construct(private readonly YoutubeVideoService $youtubeVideoService)
    {
    }

    public function index(Request $request): JsonResponse
    {
        try {
            $refresh = $request->boolean('refresh');

            if ($request->boolean('all')) {
                return response()->json([
                    'videos' => $this->youtubeVideoService->allVideos(12, $refresh),
                    'nextPageToken' => null,
                ]);
            }

            return response()->json(
                $this->youtubeVideoService->videosPage($request->query('pageToken'), $refresh)
            );
        } catch (Throwable $error) {
            return response()->json(['error' => $error->getMessage()], 500);
        }
    }

    public function show(string $videoId): JsonResponse
    {
        try {
            $video = $this->youtubeVideoService->findVideo($videoId);

            if (!$video) {
                return response()->json(['error' => 'Recipe video not found.'], 404);
            }

            $relatedVideos = collect($this->youtubeVideoService->allVideos(4))
                ->filter(fn (array $item) => $item['id'] !== $video['id'] && $item['category'] === $video['category'])
                ->take(4)
                ->values()
                ->all();

            return response()->json([
                'video' => $video,
                'relatedVideos' => $relatedVideos,
            ]);
        } catch (Throwable $error) {
            return response()->json(['error' => $error->getMessage()], 500);
        }
    }
}

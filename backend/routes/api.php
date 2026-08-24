<?php

use App\Http\Controllers\YoutubeVideoController;
use Illuminate\Support\Facades\Route;

Route::get('/videos', [YoutubeVideoController::class, 'index']);
Route::get('/videos/{videoId}', [YoutubeVideoController::class, 'show']);

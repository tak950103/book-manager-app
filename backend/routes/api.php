<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BookController;
use App\Http\Controllers\UserBookController;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/books', [BookController::class, 'store']);
    Route::get('/user-books', [UserBookController::class, 'index']);
    Route::patch('/user-books/{id}/favorite', [UserBookController::class, 'toggleFavorite']);
    Route::get('/user-books/total-read-count', [UserBookController::class, 'totalReadCount']);
    Route::get('/user-books/monthly-read-count', [UserBookController::class, 'monthlyReadCount']);
    Route::get('/user-books/most-read', [UserBookController::class, 'mostReadBook']);
    Route::get('/user-books/favorite-count', [UserBookController::class, 'favoriteCount']);
});
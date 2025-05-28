<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UserBook;

class UserBookController extends Controller
{
    public function index(Request $request)
    {
        $userId = $request->user()->id;

        $paginated = UserBook::with('book') // bookリレーションをJOIN
            ->where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        $data = $paginated->getCollection()->transform(function ($userBook) {
            return [
                'id' => $userBook->id,
                'title' => $userBook->book->title,
                'image_url' => $userBook->book->image_url,
                'created_at' => $userBook->created_at->toDateString(),
                'read_count' => $userBook->read_count,
                'is_favorite' => (bool) $userBook->is_favorite,
            ];
        });

        return response()->json([
            'data' => $data,
            'current_page' => $paginated->currentPage(),
            'last_page' => $paginated->lastPage(),
        ]);
    }

    public function toggleFavorite(Request $request, $id)
    {
        $userId = $request->user()->id;

        $userBook = \App\Models\UserBook::where('id', $id)
            ->where('user_id', $userId)
            ->firstOrFail();

        $userBook->is_favorite = !$userBook->is_favorite;
        $userBook->save();

        return response()->json([
            'success' => true,
            'is_favorite' => $userBook->is_favorite,
        ]);
    }
}

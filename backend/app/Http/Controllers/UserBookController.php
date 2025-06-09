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

    // お気に入り登録
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

    // 総登録数取得
    public function totalReadCount(Request $request)
    {
        $userId = $request->user()->id;

        $total = \App\Models\UserBook::where('user_id', $userId)->sum('read_count');

        return response()->json(['total' => $total]);
    }

    // 月ごとの登録数
    public function monthlyReadCount(Request $request)
    {
        $userId = $request->user()->id;

        $count = \App\Models\UserBook::selectRaw("DATE_FORMAT(created_at, '%Y-%m') as month, COUNT(*) as count")
            ->where('user_id', $userId)
            ->where('created_at', '>=', now()->subMonths(11)->startOfMonth())
            ->groupBy('month')
            ->orderBy('month')
            ->pluck('count', 'month');

        return response()->json($counts);
    }

    // 最多登録本取得
    public function mostReadBook(Request $request)
    {
        $userId = $request->user()->id;

        $mostRead = \App\Models\UserBook::where('user_id', $userId)
            ->with('book')
            ->orderByDesc('read_count')
            ->orderByDesc('id') //同数なら新しい方を優先
            ->first();

        if (!$mostRead) {
            return response()->json(null);
        }

        return response()->json([
            'title' => $mostRead->book->title,
            'image_url' => $mostRead->book->image_url,
            'read_count' => $mostRead->read_count,
        ]);
    }

    // お気に入り登録数取得
    public function favoriteCount(Request $request)
    {
        $userId = $request->user()->id;

        $count = \App\Models\UserBook::where('user_id', $userId)
            ->where('is_favorite', true)
            ->count();

        return response()->json(['count' => $count]);
    }

}

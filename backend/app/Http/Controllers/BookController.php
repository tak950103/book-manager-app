<?php


namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\UserBook;
use Illuminate\Http\Request;

class BookController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'isbn' => 'required|string',
            'title' => 'required|string',
            'image_url' => 'nullable|string',
        ]);

        $userId = auth()->id();

        $book = Book::firstOrCreate(
            ['isbn' => $validated['isbn']],
            ['title' => $validated['title'], 'image_url' => $validated['image_url']]
        );

        $userBook = UserBook::where('user_id', $validated['user_id'])
                            ->where('book_id', $book->id)
                            ->first();

        if ($userBook) {
            $userBook->increment('read_count');
        } else {
            UserBook::create([
                'user_id' => $validated['user_id'],
                'book_id' => $book->id,
                'read_count' => 1
            ]);
        }

        return response()->json(['success' => true]);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Book extends Model
{
    use HasFactory;

    protected $fillable = ['isbn', 'title', 'image_url'];

    public function users()
    {
        return $this->belongsToMany(User::class, 'user_books')
                    ->withPivot('read_count', 'is_favorite', 'read_at')
                    ->withTimestamps();
    }
}

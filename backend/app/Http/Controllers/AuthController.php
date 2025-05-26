<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AuthController extends Controller
{
    // ログイン処理
    public function login(Request $request)
    {
        $request->validate([
            'login_id' => 'required|string',
            'password' => 'required|string',
        ]);

        if (!Auth::attempt($request->only('login_id', 'password'))) {
            return response()->json(['message' => '認証に失敗しました'], 401);
        }
    
        $request->session()->regenerate(); // セッション再生成
        return response()->json(['message' => 'ログイン成功']);
    }

    // ログイン中ユーザー情報取得
    public function me(Request $request)
    {
        return response()->json($request->user());
    }

    // ログアウト
    public function logout(Request $request)
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json(['message' => 'ログアウトしました']);
    } 
}

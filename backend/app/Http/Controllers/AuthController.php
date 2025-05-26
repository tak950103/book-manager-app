<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
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

        $user = User::where('login_id', $request->login_id)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => '認証に失敗しました'], 401);
        }

        // トークンを発行（Bearer）
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user,
        ]);
    }

    // ログイン中ユーザー情報取得
    public function me(Request $request)
    {
        return response()->json($request->user());
    }

    // ログアウト
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'ログアウトしました']);
    } 
}

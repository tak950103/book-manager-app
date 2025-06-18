<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        User::updateOrCreate(
            ['login_id' => 'admin'],
            [
                'name' => '管理者',
                'email' => 'dummy@example.com',
                'password' => Hash::make('password123'),
                'role' => 'admin',
            ]
        );

        User::updateOrCreate(
            ['login_id' => 'ai'],
            [
                'name' => 'あい',
                'email' => 'dummy@example.com',
                'password' => Hash::make('ai'),
                'role' => 'user',
            ]
        );

        User::updateOrCreate(
            ['login_id' => 'yui'],
            [
                'name' => 'ゆい',
                'email' => 'dummy@example.com',
                'password' => Hash::make('yui'),
                'role' => 'user',
            ]
        );

    }
}

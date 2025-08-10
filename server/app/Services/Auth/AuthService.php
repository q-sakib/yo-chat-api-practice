<?php

namespace App\Services\Auth;

use App\Repositories\UserRepository;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;




use App\Models\User;

use Illuminate\Support\Str;
use Carbon\Carbon;






class AuthService
{
  protected UserRepository $users;

  public function __construct(UserRepository $users)
  {
    $this->users = $users;
  }

  public function register(array $data): string
  {
    $user = $this->users->create($data);
    return $user->createToken('auth-token')->plainTextToken;
  }

  public function login(array $credentials): ?string
  {
    $user = $this->users->findForLogin($credentials);

    if (!$user || !isset($credentials['password']) || !Hash::check($credentials['password'], $user->password)) {
      return null;
    }

    return $user->createToken('auth-token')->plainTextToken;
  }

  public function logout(): void
  {
    $user = Auth::user();

    if ($user) {
      $user->tokens()->delete();
    }
  }

  public function getUserByEmail(string $email)
  {
    return $this->users->findByEmail($email);
  }
}
<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;








use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Services\Auth\AuthService;
use App\Repositories\UserRepository;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;








class AuthController extends Controller
{
    protected AuthService $auth;
    protected UserRepository $userRepo;

    public function __construct(AuthService $auth, UserRepository $userRepo)
    {
        $this->auth = $auth;
        $this->userRepo = $userRepo;
    }

    public function register(RegisterRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $token = $this->auth->register($validated);
        // $user = Auth::user(); // get the newly registered user via auth (Sanctum auto-login)
        $user = $this->auth->getUserByEmail($validated['email']); // need a helper for this

        return response()->json([
            'message' => 'User registered successfully',
            'user'    => $user,
            'token'   => $token,
        ], 201);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $token = $this->auth->login($validated);

        if (!$token) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $user = $this->auth->getUserByEmail($validated['email']); // need a helper for this

        return response()->json([
            'message' => 'Login successful',
            'user'    => $user,
            'token'   => $token,
        ]);
    }

    public function logout(): JsonResponse
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $this->auth->logout();

        return response()->json(['message' => 'Logged out successfully']);
    }

    public function user(): JsonResponse
    {
        return response()->json(Auth::user());
    }

    public function allUsers(Request $request): JsonResponse
    {
        if (!Auth::check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $users = $this->userRepo->allUsers($request->all());

        return response()->json($users);
    }
}
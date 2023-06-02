<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\userController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\StudentInfoController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/register',[userController::class,'register']);
Route::post('/SignIn',[AuthController::class,'SignIn']);
Route::post('/storeStudentData',[StudentInfoController::class,'storeStudentData']);
Route::post('/useeffectstudentdataaddress',[StudentInfoController::class,'useEffectStoreStudentDataAddress']);
Route::post('/storeStudentDataAddress',[StudentInfoController::class,'storeStudentDataAddress']);




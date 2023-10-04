<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\userController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\StudentInfoController;
use App\Http\Controllers\DegreeController;
use App\Http\Controllers\educationAndDegreeController;
use App\Http\Controllers\ApplicationController;
use App\Http\Controllers\BoardController;
use App\Http\Controllers\VoucherController;


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


// routes/api.php


Route::get('/countries', [StudentInfoController::class, 'getAllCountries']);
Route::get('/states', [StudentInfoController::class, 'getStatesByCountryCode']);
Route::post('/register', [userController::class, 'register']);
Route::post('/SignIn', [AuthController::class, 'SignIn']);
Route::post('/storeStudentData', [StudentInfoController::class, 'storeStudentData']);
Route::post('/useeffectstudentdataaddress', [StudentInfoController::class, 'useEffectStoreStudentDataAddress']);
Route::post('/storeStudentDataAddress', [StudentInfoController::class, 'storeStudentDataAddress']);
Route::get('/degree', [DegreeController::class, 'index']);
Route::post('/educationAndDegreeController', [educationAndDegreeController::class, 'storeDegreeAndDocument']);


//deleting education
Route::post('/deleteRecordEndpoint', [educationAndDegreeController::class, 'modifyEducationStatus']);

Route::post('/skip/{user_id}', [educationAndDegreeController::class, 'skip_test']);

Route::post('/getPriority', [StudentInfoController::class, 'getPriority']);

Route::post('/autofilPriority', [ApplicationController::class, 'autofilPriority']);

Route::post('/savetestinfo', [educationAndDegreeController::class, 'createTestScore']);

Route::get('/scores/{user_id}', [educationAndDegreeController::class, 'getScoresByUserId']);

//Application Api
Route::post('/savePriorities', [ApplicationController::class, 'savePriorities']);

//Downloading pdf

Route::get('/generate-pdf', [ApplicationController::class, 'generatePdf']);
Route::post('/savevoucher', [ApplicationController::class, 'store']);

//boards
Route::get('/boards', [BoardController::class, 'index']);

Route::get('/voucherdetail', [VoucherController::class, 'index']);


//Admin APIs

Route::post('/adminlogin', [AuthController::class, 'AdminloginCheck']);

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
use App\Http\Controllers\AdminApplicationController;
use App\Http\Controllers\AdmitLetterController;
use App\Http\Controllers\ChpeController;
use App\Http\Controllers\CCNController;
use App\Http\Controllers\BioEthicsController;


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
Route::get('/testInformation/{user_id}', [educationAndDegreeController::class, 'testInformation']);


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

//Delete Test
Route::delete('/deleteTest/{id}/{studentId}', [educationAndDegreeController::class, 'deleteTest']);


//Admin APIs

Route::post('/adminlogin', [AuthController::class, 'AdminloginCheck']);

Route::get('/feeapplicationreceived/{user_id}', [AdminApplicationController::class, 'feeApplicationReceived']);

Route::get('/getfeepaidapplicants/{program_id}', [AdminApplicationController::class, 'ApplicantsfeeApplicationReceived']);
Route::get('/getfeepaidapplicantsexcel/{program_id}', [AdminApplicationController::class, 'feeReceivedExcel']);
Route::get('/getfeepaidapplicantpdf/{program_id}', [AdminApplicationController::class, 'feeReceivedPdf']);


Route::get('/getfeependingapplicantsexcel/{program_id}', [AdminApplicationController::class, 'feePendingExcel']);
Route::get('/getfeeverifiedapplicantsexcel/{program_id}', [AdminApplicationController::class, 'feeVerifiedExcel']);
Route::get('/getfeerejectedapplicantsexcel/{program_id}', [AdminApplicationController::class, 'feeRejectedExcel']);
Route::get('/getapplicationverified/{program_id}', [AdminApplicationController::class, 'appVerifiedExcel']);
Route::get('/getapplicationverifiedmeritlist/{program_id}', [AdminApplicationController::class, 'appVerifiedMeritList']);

Route::get('/getapplicationrejected/{program_id}', [AdminApplicationController::class, 'appRejectedExcel']);

Route::get('/getfeependingapplicants/{program_id}', [AdminApplicationController::class, 'ApplicantsfeeApplicationPending']);
Route::get('/getfeeverifiedapplicants/{program_id}', [AdminApplicationController::class, 'ApplicantsfeeApplicationVerified']);
Route::get('/getverifiedapplicants/{program_id}', [AdminApplicationController::class, 'ApplicantsApplicationVerified']);

Route::get('/getfeerejectedapplicants/{program_id}', [AdminApplicationController::class, 'ApplicantsfeeApplicationRejected']);

Route::get('/getrejectedapplicants/{program_id}', [AdminApplicationController::class, 'ApplicantsApplicationRejected']);

Route::get('/getStudentDetail/{student_id}/{program_id}', [AdminApplicationController::class, 'fetchAllStudentData']);



Route::post('/verify-application', [AdminApplicationController::class, 'verifyApplication']);
Route::post('/reject-application', [AdminApplicationController::class, 'rejectApplication']);

Route::post('/rejectt-application', [AdminApplicationController::class, 'rejecttApplication']);

Route::post('/updateEducationData', [AdminApplicationController::class, 'updateEducationData']);

Route::post('/updateTestData', [AdminApplicationController::class, 'updateTestData']);




Route::post('/accept-application', [AdminApplicationController::class, 'acceptApplication']);



Route::get('/download-receipt/{filename}', [AdminApplicationController::class, 'getPdf']);


Route::get('/download-studentImage/{filename}', [AdminApplicationController::class, 'getPdfStudent']);

Route::get('/download-studentImageCnic/{filename}', [AdminApplicationController::class, 'getPdfStudentCnic']);
Route::get('/download-studentDegree/{filename}', [AdminApplicationController::class, 'getPdfStudentDegree']);
Route::get('/download-studentTest/{filename}', [AdminApplicationController::class, 'getPdfStudentTest']);
Route::post('/sendadmitletter', [AdmitLetterController::class, 'sendAdmitLetter']);
Route::get('/admit-letter/status', [AdmitLetterController::class, 'index']);

// CHPE APIs

Route::post('/savechpeform', [ChpeController::class, 'store']);
Route::get('chpe-form/{user_id}', [ChpeController::class,'showByUserId']);
Route::get('/download-challan/{user_id}', [ChpeController::class, 'generatePdf']);
Route::post('/upload-challan', [ChpeController::class, 'uploadVoucher']);
// CHPE APIs Admin
Route::get('/chpe-applicants', [ChpeController::class, 'index']);


// Bio Ethics APIs
Route::post('/savebioethicsform', [BioEthicsController::class, 'store']);
Route::get('bioethics-form/{user_id}', [BioEthicsController::class,'showByUserId']);
Route::get('/download-challan-bioethics/{user_id}', [BioEthicsController::class, 'generatePdf']);
Route::post('/upload-challan-bioethics', [BioEthicsController::class, 'uploadVoucher']);

// Bio Ethics APIs Admin
Route::get('/bioethics-applicants', [BioEthicsController::class, 'index']);

//CCN
Route::post('/saveccnform', [CCNController::class, 'store']);
Route::get('ccn-form/{user_id}', [CCNController::class,'showByUserId']);
Route::get('/download-challan-ccn/{user_id}', [CCNController::class, 'generatePdf']);
Route::post('/upload-challan-ccn', [CCNController::class, 'uploadVoucher']);
Route::get('/ccn-applicants', [CCNController::class, 'index']);

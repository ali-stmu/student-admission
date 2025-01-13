<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CCN;
use Illuminate\Support\Facades\Log;
use Dompdf\Dompdf;

use PDF;

class CCNController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $applicants = CCN::where('term_id', 2)
        ->where('status', 'uploaded')
        ->get();

    
        // Append the full URL for each attachment
        foreach ($applicants as $applicant) {
            $applicant->cnic_passport_picture_url = url('storage/images/cnicPicture/' . basename($applicant->cnic_passport_picture));
            $applicant->candidate_picture_url = url('storage/images/candidatePicture/' . basename($applicant->candidate_picture));
            $applicant->highest_degree_picture_url = url('storage/images/highestDegreePicture/' . basename($applicant->highest_degree_picture));
            $applicant->voucher = url('storage/images/vouchers/' . basename($applicant->voucher_image_path));

        }
    
        return response()->json($applicants, 200);
    }
    

    

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'candidateName' => 'required|string|max:255',
            'user_id' => 'required|string|max:255',
            'fatherName' => 'required|string|max:255',
            'phoneNumber' => 'required|string|max:20',
            'email' => 'required|string|email|max:255',
            'mailingAddress' => 'required|string',
            'professionalRegNumber' => 'nullable|string|max:100',
            'highestDegreeTitle' => 'nullable|string|max:100',
            // 'cnicPicture' => 'required|image|max:10240', // max 10MB
            // 'candidatePicture' => 'required|image|max:10240', // max 10MB
            //'highestDegreePicture' => 'required|image|max:10240', // max 10MB
        ]);
    
        // Handle file uploads
        // $cnicPicturePath = $request->file('cnicPicture')->store('public/images/cnicPicture');
        // $candidatePicturePath = $request->file('candidatePicture')->store('public/images/candidatePicture');
        //$highestDegreePicturePath = $request->file('highestDegreePicture')->store('public/images/highestDegreePicture');
    
        // Update or create a new record in the database
        $CCN = CCN::updateOrCreate(
            ['user_id' => $validatedData['user_id']],
            [
                'candidate_name' => $validatedData['candidateName'],
                'father_name' => $validatedData['fatherName'],
                'phone_number' => $validatedData['phoneNumber'],
                'email' => $validatedData['email'],
                'mailing_address' => $validatedData['mailingAddress'],
                'highest_degree_title' => $validatedData['highestDegreeTitle'],
                'status' => 'Pending',
                'term_id' => 2,
                'professional_reg_number' => $validatedData['professionalRegNumber'],
                // 'cnic_passport_picture' => $cnicPicturePath,
                // 'candidate_picture' => $candidatePicturePath,
                // 'highest_degree_picture' => $highestDegreePicturePath,
            ]
        );
    
        return response()->json(['message' => 'Form submitted successfully'], 200);
    }
    

    public function generatePdf(Request $request, $user_id)
    {
        try {
            $userId = $user_id;
            
            // Fetch student data based on user_id
            $CCN = CCN::where('user_id', $userId)->first();
    
            if (!$CCN) {
                return response()->json(['message' => 'CCN form data not found for the user_id.'], 404);
            }
    
            $fullName = $CCN->candidate_name;
            $issueDate = now()->format('Y-m-d');
            $voucherID = $userId . '-' . now()->format('Ymd');
    
            $fullpath = storage_path('app/bank_logo/ShifaLogo.png'); 
            $bankLogoFullPath = storage_path('app/bank_logo/HBL-logo.jpg');
    
            $data = [
                'collegeName' => 'Department of Health Professional Education',
                'voucherID' => $voucherID,
                'date' => $issueDate,
                'dueDate' => '2025-01-28',
                'AccountTitle' => 'SHIFA TAMEER-MILLAT UNIVERSITY',
                'bankAccountNumber' => '50007902906303',
                'programName' => 'Certificate in Clinical Nutrition',  // Hardcoded as given in your original code
                'studentName' => $fullName,
                'pyear' => 'Spring 2025',
                'session' => 'Spring 2025',
                'totalAmount' => 5000,
                'uniLogo' => $fullpath,
                'bankLogo' => $bankLogoFullPath,
                'amountInWords' => 'Eight Thousand only',
            ];
    
            $pdf = PDF::loadView('challan', compact('data'));
    
            return $pdf->download('challan.pdf');
        } catch (\Exception $e) {
            // Handle any exceptions here
            Log::error('An error occurred: ' . $e->getMessage());
            return response()->json(['error' => 'An error occurred'], 500);
        }
    }
        /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }
    public function showByUserId(Request $request,$user_id)
    {
        log::debug("Form wala function");
        // Validate request

        // Fetch CCN form data
        $CCNData = CCN::where('user_id', $user_id)->first();
        log::debug($CCNData);

        if (!$CCNData) {
            return response()->json(['message' => 'CCN form data not found for the user_id.'], 404);
        }
        
        return response()->json($CCNData, 200);
        
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }
    public function uploadVoucher(Request $request)
    {
    log::debug("Voucher upload function");
    $validatedData = $request->validate([
        'user_id' => 'required|string|max:255',
        'challan' => 'required|max:10240', // max 10MB
    ]);
    log::debug($validatedData['user_id']);
    
    try {
        // Handle file upload
        $voucherPath = $request->file('challan')->store('public/images/vouchers');

        // Find the corresponding CCN form record
        $CCN = CCN::where('user_id', $validatedData['user_id'])->first();
        if (!$CCN) {
            return response()->json(['message' => 'CCN form data not found for the user_id.'], 404);
        }

        // Update the voucher image path and status
        $CCN->voucher_image_path = $voucherPath;
        $CCN->status = 'uploaded';
        $CCN->save();

        return response()->json(['message' => 'Voucher uploaded successfully'], 200);
    } catch (\Exception $e) {
        Log::error('An error occurred: ' . $e->getMessage());
        return response()->json(['error' => 'An error occurred while uploading the voucher'], 500);
    }
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}

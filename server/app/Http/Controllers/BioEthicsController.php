<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\BioEthicsForm;
use Illuminate\Support\Facades\Log;
use Dompdf\Dompdf;

use PDF;

class BioEthicsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $applicants = BioEthicsForm::all();
    
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
        'cnicPicture' => 'required|image|max:10240', // max 10MB
        'candidatePicture' => 'required|image|max:10240', // max 10MB
        'highestDegreePicture' => 'required|image|max:10240', // max 10MB
    ]);

    // Handle file uploads
    $cnicPicturePath = $request->file('cnicPicture')->store('public/images/cnicPicture');
    $candidatePicturePath = $request->file('candidatePicture')->store('public/images/candidatePicture');
    $highestDegreePicturePath = $request->file('highestDegreePicture')->store('public/images/highestDegreePicture');

    // Check if the record already exists
    $BioEthicsForm = BioEthicsForm::updateOrCreate(
        ['user_id' => $validatedData['user_id']],
        [
            'candidate_name' => $validatedData['candidateName'],
            'father_name' => $validatedData['fatherName'],
            'phone_number' => $validatedData['phoneNumber'],
            'email' => $validatedData['email'],
            'mailing_address' => $validatedData['mailingAddress'],
            'status' => 'Pending',
            'professional_reg_number' => $validatedData['professionalRegNumber'],
            'cnic_passport_picture' => $cnicPicturePath,
            'candidate_picture' => $candidatePicturePath,
            'highest_degree_picture' => $highestDegreePicturePath,
        ]
    );

    return response()->json(['message' => 'Form submitted successfully'], 200);
}


    public function generatePdf(Request $request, $user_id)
    {
        try {
            $userId = $user_id;
            
            // Fetch student data based on user_id
            $BioEthicsForm = BioEthicsForm::where('user_id', $userId)->first();
    
            if (!$BioEthicsForm) {
                return response()->json(['message' => 'CHPE form data not found for the user_id.'], 404);
            }
    
            $fullName = $BioEthicsForm->candidate_name;
            $issueDate = now()->format('Y-m-d');
            $voucherID = $userId . '-' . now()->format('Ymd');
    
            $fullpath = storage_path('app/bank_logo/ShifaLogo.png'); 
            $bankLogoFullPath = storage_path('app/bank_logo/HBL-logo.jpg');
    
            $data = [
                'collegeName' => 'Shifa College of Pharmaceutical Sciences',
                'voucherID' => $voucherID,
                'date' => $issueDate,
                'dueDate' => '2024-10-15',
                'AccountTitle' => 'SHIFA TAMEER-MILLAT UNIVERSITY',
                'bankAccountNumber' => '50007902906303',
                'programName' => 'Bioethics & Professionalism',  // Hardcoded as given in your original code
                'studentName' => $fullName,
                'pyear' => 'Fall 2024',
                'session' => 'Fall 2024',
                'totalAmount' => 2500,
                'uniLogo' => $fullpath,
                'bankLogo' => $bankLogoFullPath,
                'amountInWords' => 'Twenty Five Hundred only',
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

        // Fetch CHPE form data
        $BioEthicsFormData = BioEthicsForm::where('user_id', $user_id)->first();
        log::debug($BioEthicsFormData);

        if (!$BioEthicsFormData) {
            return response()->json(['message' => 'CHPE form data not found for the user_id.'], 404);
        }
        
        return response()->json($BioEthicsFormData, 200);
        
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

        // Find the corresponding CHPE form record
        $BioEthicsForm = BioEthicsForm::where('user_id', $validatedData['user_id'])->first();
        if (!$BioEthicsForm) {
            return response()->json(['message' => 'CHPE form data not found for the user_id.'], 404);
        }

        // Update the voucher image path and status
        $BioEthicsForm->voucher_image_path = $voucherPath;
        $BioEthicsForm->status = 'uploaded';
        $BioEthicsForm->save();

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

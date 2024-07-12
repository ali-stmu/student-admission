<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ChpeForm;
use Illuminate\Support\Facades\Log;
use Dompdf\Dompdf;

use PDF;

class ChpeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $applicants = ChpeForm::all();
    
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

        // Save form data to database
        $chpeForm = new ChpeForm();
        $chpeForm->candidate_name = $validatedData['candidateName'];
        $chpeForm->user_id = $validatedData['user_id'];
        $chpeForm->father_name = $validatedData['fatherName'];
        $chpeForm->phone_number = $validatedData['phoneNumber'];
        $chpeForm->email = $validatedData['email'];
        $chpeForm->mailing_address = $validatedData['mailingAddress'];
        $chpeForm->status = 'Pending';
        $chpeForm->professional_reg_number = $validatedData['professionalRegNumber'];
        $chpeForm->cnic_passport_picture = $cnicPicturePath;
        $chpeForm->candidate_picture = $candidatePicturePath;
        $chpeForm->highest_degree_picture = $highestDegreePicturePath;
        $chpeForm->save();

        return response()->json(['message' => 'Form submitted successfully'], 200);
    }

    public function generatePdf(Request $request, $user_id)
    {
        try {
            $userId = $user_id;
            
            // Fetch student data based on user_id
            $chpeForm = ChpeForm::where('user_id', $userId)->first();
    
            if (!$chpeForm) {
                return response()->json(['message' => 'CHPE form data not found for the user_id.'], 404);
            }
    
            $fullName = $chpeForm->candidate_name;
            $issueDate = now()->format('Y-m-d');
            $voucherID = $userId . '-' . now()->format('Ymd');
    
            $fullpath = storage_path('app/bank_logo/ShifaLogo.png'); 
            $bankLogoFullPath = storage_path('app/bank_logo/HBL-logo.jpg');
    
            $data = [
                'collegeName' => 'Department of Health Professional Education',
                'voucherID' => $voucherID,
                'date' => $issueDate,
                'dueDate' => '2024-06-24',
                'AccountTitle' => 'SHIFA TAMEER-MILLAT UNIVERSITY',
                'bankAccountNumber' => '50007902906303',
                'programName' => 42,  // Hardcoded as given in your original code
                'studentName' => $fullName,
                'pyear' => 'Fall 2024',
                'session' => 'Fall 2024',
                'totalAmount' => 8000,
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

        // Fetch CHPE form data
        $chpeFormData = ChpeForm::where('user_id', $user_id)->first();
        log::debug($chpeFormData);

        if (!$chpeFormData) {
            return response()->json(['message' => 'CHPE form data not found for the user_id.'], 404);
        }
        
        return response()->json($chpeFormData, 200);
        
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
        $chpeForm = ChpeForm::where('user_id', $validatedData['user_id'])->first();
        if (!$chpeForm) {
            return response()->json(['message' => 'CHPE form data not found for the user_id.'], 404);
        }

        // Update the voucher image path and status
        $chpeForm->voucher_image_path = $voucherPath;
        $chpeForm->status = 'uploaded';
        $chpeForm->save();

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

<?php

namespace App\Http\Controllers;
use App\Models\Admin;
use App\Models\Program; // Import the Program model
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;


class AdminApplicationController extends Controller
{
    public function feeApplicationReceived(Request $request, $user_id)
    {
        try {
            // Use Eloquent to retrieve the admin details based on the user_id.
            $admin = Admin::where('user_id', $user_id)->first();

            if ($admin) {
                // Retrieve all programs where admin.college_id matches program.college_id
                $programs = Program::where('college_id', $admin->college_id)->get();

                if ($programs->isEmpty()) {
                    return response()->json(['message' => 'No programs found for this college'], 404);
                }
                log::debug($programs);

                // You can access the program data in $programs as needed.
                // For example, if you want to return the list of programs:
                $programData = $programs->toArray();

                $data = [
                    'programs' => $programData, // Add the programs data to the response.
                    // Add more attributes as needed.
                ];

                return response()->json($data);
            } else {
                // Admin not found for the given user_id.
                return response()->json(['message' => 'Admin not found'], 404);
            }
        } catch (\Exception $e) {
            // Handle any exceptions that might occur during the database query.
            Log::error($e->getMessage());
            return response()->json(['message' => 'An error occurred'], 500);
        }
    }
}

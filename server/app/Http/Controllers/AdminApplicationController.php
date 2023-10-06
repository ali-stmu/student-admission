<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;


class AdminApplicationController extends Controller
{
    public function feeApplicationReceived(Request $request, $user_id)
    {
        // You can use the $user_id parameter in your logic to fetch data or perform any actions.
        // For example, you can retrieve data from the database based on the user_id.
        
        // Replace this with your logic:
        $data = [
            'user_id' => $user_id,
            // Add more data as needed.
        ];
        log::debug($data);

        return response()->json($data);
    }
}

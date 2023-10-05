<?php
namespace App\Http\Controllers;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

use Illuminate\Http\Request;
use App\Models\User;

class AuthController extends Controller
{
    //
    function AdminloginCheck(Request $request)
    { 
        $email = $request->input('email');
        $password = $request->input('password');
    
        // Find the user by email
        $user = User::where('email', $email)->first();
        log::debug($user);
    
        if (!$user) {
            // User with the provided email doesn't exist
            $data = [
                'error' => 'User not found'
            ];
            return response()->json($data, 404);
        }
    
        // Check if the password matches
        if (Hash::check($password, $user->password)) {
            // Check if the user has the "admin" role
            log::debug("Password match hoo gya");
            if ($user->role === 'Admin') {
                // User is an admin, respond with "OK"
                $data = [
                    'message' => 'Admin authenticated'
                ];
               $admin_detail = $this->getUserDetails($email);
               log::debug($admin_detail);
                return response()->json($admin_detail,200);
            } else {
                // User does not have the "admin" role
                $data = [
                    'error' => 'User is not an admin'
                ];
                return response()->json($data, 403);
            }
        } else {
            // Password does not match
            $data = [
                'error' => 'Invalid password'
            ];
            return response()->json($data, 400);
        }
    }
    

    public function getUserDetails($email) {
        $user = User::where('email', $email)->first();
        $details = DB::table('user')->where('email', $email)->first();
        $data = [
          'user' => $user,
          'details' => $details
        ];
        //log::debug($data);
        return response()->json($data, 200);
      }

    function SignIn(Request $request)
    { 
        $email=$request->input('email');
        $password=$request->input('password');
        $user = User::where('email', $email)->first();

        if ($user && Hash::check($password, $user->password)) {
            
                log::debug("matched");
                $data = [
                    'message' => 'Matched'
                  ];
                //return response()->json($data, 200);
          return response()->json($this->getUserDetails($email),200);
            
            }
           else {
            $data = [
                'error' => 'Invalid'
              ];
            return response()->json($data, 400);
            // Password does not match
            response()->json(['Error' => 'Invalid Email or Password']);
          }
    }
  


    
}

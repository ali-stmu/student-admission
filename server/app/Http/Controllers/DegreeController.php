<?php

namespace App\Http\Controllers;

use App\Models\Degree;

class DegreeController extends Controller
{
    public function index()
    {
        $degree = Degree::all();
        return response()->json($degree);
    }
}

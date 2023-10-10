<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Board;

class BoardController extends Controller
{
    public function index()
    {
        // Fetch all boards from the 'boards' table
        $boards = Board::all();

        // Return the boards as JSON response
        return response()->json($boards);
    }
}

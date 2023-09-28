<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Session extends Model
{
    protected $primaryKey = 'session_id'; // Set the primary key column name
    protected $fillable = [
        'program_id', // Replace with the actual column names in your 'session' table
        'term_id',
        'due_date',
        'amount',
        'status',
        // Add other columns here
    ];
    
}

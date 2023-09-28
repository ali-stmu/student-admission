<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Term extends Model
{
    protected $table = 'term'; // Set the primary key column name
    protected $primaryKey = 'term_id'; // Set the primary key column name
    protected $fillable = [
        'term_name', // Replace with the actual column names in your 'session' table
        'status',
        // Add other columns here
    ];
}

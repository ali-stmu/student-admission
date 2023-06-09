<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class document extends Model
{
    use HasFactory;

    protected $table = 'document';
    protected $primaryKey = 'document_id';

    protected $fillable = [
        'student_id',
        'document_name',
        'document_file_name',
        'upload_date',
        'status',
        'created_by',
        'updated_by',
    ];
}

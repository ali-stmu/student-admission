<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Board extends Model
{
    protected $table = "board";
    protected $primaryKey = "board_id";

    protected $fillable = [
        'board_name',
    ];
}

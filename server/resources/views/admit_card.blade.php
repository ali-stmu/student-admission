<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admit Card</title>
    <style>
        body {
            font-family: 'Times New Roman', Times, serif, sans-serif;
        }

        .admit-card {
            width: 100%;
            border: 1px solid #000;
            margin: 10px auto;
        }

        .admit-card h2,
        .admit-card h3 {
            text-align: center;
            margin-bottom: 1px;
        }

        .admit-card p {
            margin-bottom: 0.5px;
        }

        .p-center {
            text-align: center;
        }

        .admit-card li {
            font-size: 12px;
        }

        .detail-box {
            /* border: 1px solid #000; */
            padding: 10px;
            margin: 5px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        .picture-box {
            width: 120px;
            height: 120px;
            /*border: 1px solid #000;*/
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .picture-box img {
            max-height: 100%;
            max-width: 100%;
        }

        /* Default position for the picture */
        .fixed-picture {
            position: fixed;
            top: 30px;
            right: 10px;
        }

        .fixed-picture-uni {
            position: fixed;
            top: 30px;
            left: 10px;
        }
    </style>
</head>

<body>

    <div class="admit-card">
        @if (
            $data['program_id'] == 8 ||
                $data['program_id'] == 49 ||
                $data['program_id'] == 72 ||
                ($data['program_id'] == 41 &&
                    $data['program_id'] != 20 &&
                    $data['program_id'] != 21 &&
                    $data['program_id'] != 22 &&
                    $data['program_id'] != 23))
            <div class="fixed-picture picture-box">
                <img style="max-height: 150px" src="{{ $data['student_img'] ?? '' }}">
            </div>
        @endif
        @if (
            $data['program_id'] == 20 ||
                $data['program_id'] == 49 ||
                $data['program_id'] == 72 ||
                $data['program_id'] == 41 ||
                $data['program_id'] == 21 ||
                $data['program_id'] == 22 ||
                $data['program_id'] == 23 ||
                $data['program_id'] == 54 ||
                $data['program_id'] == 55 ||
                $data['program_id'] == 56 ||
                $data['program_id'] == 64 ||
                $data['program_id'] == 65 ||
                $data['program_id'] == 66 ||
                $data['program_id'] == 67 ||
                $data['program_id'] == 68 ||
                $data['program_id'] == 69)
            <div class="fixed-picture-uni picture-box">
                <img style="max-height: 150px" src="{{ $data['uni_logo_img'] ?? '' }}">
            </div>
        @endif
        <h2>Shifa Tameer-e-Millat University</h2>
        <h3>Admit Card</h3>
        <h3>{{ $data['college_name'] ?? '' }}</h3>
        <h3>{{ $data['program_name'] ?? '' }}</h3>
        <p class="p-center">For Intake Year: Spring-2026</p>
        @if (
            $data['program_id'] == 20 ||
                $data['program_id'] == 21 ||
                $data['program_id'] == 22 ||
                $data['program_id'] == 23 ||
                $data['program_id'] == 54 ||
                $data['program_id'] == 55 ||
                $data['program_id'] == 56 ||
                $data['program_id'] == 64 ||
                $data['program_id'] == 65 ||
                $data['program_id'] == 66 ||
                $data['program_id'] == 67 ||
                $data['program_id'] == 68 ||
                $data['program_id'] == 69)

            <p class="p-center"><strong>Entrance Test Roll No:</strong>
                @if ($data['program_id'] == 20)
                    DPT-2025-{{ $data['student_id'] ?? '' }}
                @elseif ($data['program_id'] == 21)
                    BSAUD-2025-{{ $data['student_id'] ?? '' }}
                @elseif ($data['program_id'] == 22)
                    BSSLP-2025-{{ $data['student_id'] ?? '' }}
                @elseif ($data['program_id'] == 23)
                    MSPT-2025-{{ $data['student_id'] ?? '' }}
                @elseif ($data['program_id'] == 54)
                    MSRS-2025-{{ $data['student_id'] ?? '' }}
                @elseif ($data['program_id'] == 55)
                    MSRS-2025-{{ $data['student_id'] ?? '' }}
                @elseif ($data['program_id'] == 56)
                    MSRS-2025-{{ $data['student_id'] ?? '' }}
                @elseif ($data['program_id'] == 64)
                    MPT(NPT)-2025-{{ $data['student_id'] ?? '' }}
                @elseif ($data['program_id'] == 65)
                    MPT(OMPT)-2025-{{ $data['student_id'] ?? '' }}
                @elseif ($data['program_id'] == 66)
                    MPT(CPT)-2025-{{ $data['student_id'] ?? '' }}
                @elseif ($data['program_id'] == 67)
                    MPT(SPT)-2025-{{ $data['student_id'] ?? '' }}
                @elseif ($data['program_id'] == 68)
                    MPT(WHPT)-2025-{{ $data['student_id'] ?? '' }}
                @elseif ($data['program_id'] == 69)
                    PhD-RS-2025-{{ $data['student_id'] ?? '' }}
                @endif
            </p>
        @endif
        <div class="detail-box">
            @if (
                $data['program_id'] == 20 ||
                    $data['program_id'] == 22 ||
                    $data['program_id'] == 23 ||
                    $data['program_id'] == 54 ||
                    $data['program_id'] == 55 ||
                    $data['program_id'] == 56 ||
                    $data['program_id'] == 64 ||
                    $data['program_id'] == 65 ||
                    $data['program_id'] == 66 ||
                    $data['program_id'] == 67 ||
                    $data['program_id'] == 68 ||
                    $data['program_id'] == 69)
                <div>
                    <div class="picture-box" style="float: right; margin-left: 15px; margin-top: -10px;">
                        <img src="{{ $data['student_img'] ?? '' }}">
                    </div>
                    <p><strong>Candidate Name:</strong> {{ $data['student_first_name'] ?? '' }}
                        {{ $data['student_last_name'] ?? '' }}</p>
                    <p><strong>Father's Name:</strong> {{ $data['father_name'] ?? ('' ?? '') }}</p>
                    <p><strong>CNIC No:</strong> {{ $data['cnic'] ?? ('' ?? '') }}</p>
                    <p><strong>Program Name:</strong> {{ $data['program_name'] ?? '' }}</p>
                </div>

                @if (
                    $data['program_id'] == 20 ||
                        $data['program_id'] == 21 ||
                        $data['program_id'] == 22 ||
                        $data['program_id'] == 23 ||
                        $data['program_id'] == 54 ||
                        $data['program_id'] == 55 ||
                        $data['program_id'] == 56 ||
                        $data['program_id'] == 64 ||
                        $data['program_id'] == 65 ||
                        $data['program_id'] == 66 ||
                        $data['program_id'] == 67 ||
                        $data['program_id'] == 68 ||
                        $data['program_id'] == 69)
                    <hr>
                @endif

                <!-- <p><strong>Test Date:</strong> -->
            @endif
            <p><strong>Test Date:</strong>
                @if ($data['program_id'] == 34 || $data['program_id'] == 35)
                    Monday, June 23<sup>th</sup>, 2025
                @elseif ($data['program_id'] == 8)
                    Saturday, October 18<sup>th</sup>, 2025
                @elseif (
                    $data['program_id'] == 20 ||
                        $data['program_id'] == 21 ||
                        $data['program_id'] == 22 ||
                        $data['program_id'] == 23 ||
                        $data['program_id'] == 54 ||
                        $data['program_id'] == 55 ||
                        $data['program_id'] == 56 ||
                        $data['program_id'] == 64 ||
                        $data['program_id'] == 65 ||
                        $data['program_id'] == 66 ||
                        $data['program_id'] == 67 ||
                        $data['program_id'] == 68 ||
                        $data['program_id'] == 69)
                    Monday, September 15<sup>th</sup>, 2025
                @elseif($data['program_id'] == 49)
                    Sunday, November 30<sup>th</sup>, 2025
                @elseif($data['program_id'] == 41)
                    Saturday, November 29<sup>th</sup>, 2025
                @elseif($data['program_id'] == 72)
                    Saturday, November 29<sup>th</sup>, 2025 (BSMT)
                    Sunday, November 30<sup>th</sup>, 2025 (ASMT)
                @endif
            </p>
            @if (
                $data['program_id'] == 20 ||
                    $data['program_id'] == 21 ||
                    $data['program_id'] == 22 ||
                    $data['program_id'] == 23 ||
                    $data['program_id'] == 54 ||
                    $data['program_id'] == 55 ||
                    $data['program_id'] == 56 ||
                    $data['program_id'] == 64 ||
                    $data['program_id'] == 65 ||
                    $data['program_id'] == 66 ||
                    $data['program_id'] == 67 ||
                    $data['program_id'] == 68 ||
                    $data['program_id'] == 69)
                @if ($data['program_id'] == 69)
                    <p><strong>Reporting Time:</strong> 10:30 AM</p>
                    <p><strong>Test Time:</strong> 11:00 AM to 01:00 PM</p>
                @else
                    <p><strong>Reporting Time:</strong> 09:00 AM</p>
                    <p><strong>Test Time:</strong> 10:00 AM</p>
                    <p><strong>Interview Date & Time:</strong>Monday, September 15<sup>th</sup>, 2025 at 11:00 AM
                        Onwards</p>
                @endif
            @elseif ($data['program_id'] == 49)
                <p><strong>Reporting Time:</strong> 09:00 AM</p>
                <p><strong>Test Time:</strong> 10:00 AM</p>
            @elseif ($data['program_id'] == 41)
                <p><strong>Reporting Time:</strong> 09:00 AM</p>
                <p><strong>Test Time:</strong> 10:00 AM</p>
            @else
                <p><strong>Reporting Time:</strong> 09:00 AM</p>
                <p><strong>Test Time:</strong> 10:00 AM</p>
            @endif

            <p><strong>Venue:</strong>
                @if ($data['program_id'] == 34 || $data['program_id'] == 35)
                    National Testing Service (NTS) Plot # 96, Street4, Sector H-8/1,
                    Islamabad (Tel: 051-8463619)
                @elseif ($data['program_id'] == 8)
                    Shifa Tameer-e-Millat University Park Road Campus, Chak Shahzad, Islamabad.
                @elseif (
                    $data['program_id'] == 20 ||
                        $data['program_id'] == 21 ||
                        $data['program_id'] == 22 ||
                        $data['program_id'] == 23 ||
                        $data['program_id'] == 54 ||
                        $data['program_id'] == 55 ||
                        $data['program_id'] == 56 ||
                        $data['program_id'] == 64 ||
                        $data['program_id'] == 65 ||
                        $data['program_id'] == 66 ||
                        $data['program_id'] == 67 ||
                        $data['program_id'] == 68 ||
                        $data['program_id'] == 69)
                    Department of Rehabilitation Sciences, Shifa Tameer-e-Millat University, (Park Road Campus), Park
                    Road, Chak Shehzad , Islamabad.
                @elseif($data['program_id'] == 49 || $data['program_id'] == 41 || $data['program_id'] == 72)
                    Shifa Tameer e Millat University, Park Road, Near Comsats
                    University, Islamabad. Ph. No: 051-8463983, 0307-0722938
                @elseif($data['program_id'] == 41)
                    Shifa College of Pharmaceutical Sciences, Shifa Tameer-e-
                    Millat University, H-8/4, Islamabad, Pakistan.
                @endif

            </p>
            @if (
                $data['program_id'] == 20 ||
                    $data['program_id'] == 21 ||
                    $data['program_id'] == 22 ||
                    $data['program_id'] == 23 ||
                    $data['program_id'] == 54 ||
                    $data['program_id'] == 55 ||
                    $data['program_id'] == 56 ||
                    $data['program_id'] == 64 ||
                    $data['program_id'] == 65 ||
                    $data['program_id'] == 66 ||
                    $data['program_id'] == 67 ||
                    $data['program_id'] == 68)
                <hr>
            @endif
            @if (
                $data['program_id'] != 20 &&
                    $data['program_id'] != 21 &&
                    $data['program_id'] != 22 &&
                    $data['program_id'] != 23 &&
                    $data['program_id'] != 54 &&
                    $data['program_id'] != 55 &&
                    $data['program_id'] != 56 &&
                    $data['program_id'] != 64 &&
                    $data['program_id'] != 65 &&
                    $data['program_id'] != 66 &&
                    $data['program_id'] != 67 &&
                    $data['program_id'] != 68 &&
                    $data['program_id'] != 69)

                <p><strong>Entrance Test Roll No:</strong>
                    @if ($data['program_id'] == 34)
                        PRN-2024-{{ $data['student_id'] ?? '' }}
                    @elseif ($data['program_id'] == 35)
                        MSN-2025-{{ isset($data['student_id']) ? substr($data['student_id'], -4) : '' }}
                    @elseif ($data['program_id'] == 8)
                        BSN-2025-{{ $data['student_id'] ? substr($data['student_id'], -4) : '' }}
                    @elseif ($data['program_id'] == 41)
                        BSMT-2025-{{ isset($data['student_id']) ? substr($data['student_id'], -4) : '' }}
                    @elseif ($data['program_id'] == 49)
                        ASMT-2025-{{ isset($data['student_id']) ? substr($data['student_id'], -4) : '' }}
                    @elseif ($data['program_id'] == 72)
                        Both ASMT & BSMT-2025-{{ isset($data['student_id']) ? substr($data['student_id'], -4) : '' }}
                    @endif
                </p>
            @endif
            @if (
                ($data['program_id'] != 20 &&
                    $data['program_id'] == 35 &&
                    $data['program_id'] != 21 &&
                    $data['program_id'] != 22 &&
                    $data['program_id'] != 23) ||
                    $data['program_id'] != 54 ||
                    $data['program_id'] != 55 ||
                    $data['program_id'] != 56 ||
                    $data['program_id'] != 64 ||
                    $data['program_id'] != 65 ||
                    $data['program_id'] != 66 ||
                    $data['program_id'] != 67 ||
                    $data['program_id'] != 68 ||
                    $data['program_id'] != 69)
                <p><strong>Candidate Name:</strong> {{ $data['student_first_name'] ?? '' }}
                    {{ $data['student_last_name'] ?? '' }}</p>
                <p><strong>Father's Name:</strong> {{ $data['father_name'] ?? ('' ?? '') }}</p>
                <p><strong>CNIC No:</strong> {{ $data['cnic'] ?? ('' ?? '') }}</p>
            @endif
        </div>
        @if (
            $data['program_id'] == 20 ||
                $data['program_id'] == 21 ||
                $data['program_id'] == 22 ||
                $data['program_id'] == 23 ||
                $data['program_id'] == 54 ||
                $data['program_id'] == 55 ||
                $data['program_id'] == 56 ||
                $data['program_id'] == 64 ||
                $data['program_id'] == 65 ||
                $data['program_id'] == 66 ||
                $data['program_id'] == 67 ||
                $data['program_id'] == 68 ||
                $data['program_id'] == 69)
            @if ($data['program_id'] == 69)
                <p><strong>Test Pattern</strong></p>
                <ol>
                    <li>Entry test of PhD in Rehabilitation Sciences will Comprise of 100 MCQs (Research:70, English:15,
                        Field/domain Specific:15) that are to
                        be completed within 02 Hours.</li>
                    <li>All questions carry equal marks (1 mark each). There is NO negative marking in the paper.</li>
                </ol>
            @else
                <p><strong>Test Pattern</strong></p>
                <ol>
                    <li>Entry test for DPT, BS-AUD, BS-SLP, BS-PO, MSRS and MS-PT comprises of 100 MCQs that are to be
                        completed within 02 Hours.</li>
                    <li>All questions carry equal marks (1 mark each). There is NO negative marking in the paper.</li>
                </ol>
            @endif
            <p><strong>General Instructions:</strong></p>
            <ol>
                @if ($data['program_id'] == 69)
                    <li>Do bring your original Identity Card and academic documents, i.e., Transcripts, Degrees of the
                        Undergraduate and Postgraduate
                        along with one photocopy of each document.</li>
                @else
                    <li>Do bring your original Identity card/B-form and academic documents, i.e., marks sheet and
                        certificate (Matric, F.Sc, and MDCAT if attempted), along with one photocopy of each document.
                    </li>
                @endif
                <li>Once inside the test venue, mark your attendance at the registration/information desk and follow the
                    instructions to find the seat marked with your test Roll No.</li>
                <li>Once the test is complete, remain seated until otherwise guided by the invigilation staff.</li>
                <li>You will be provided an Optical Mark Reader (OMR) sheet at the start of the test. Mark your test
                    Roll No. on it. You may use any blue or black ball pen/lead pencil to mark your roll number and the
                    answers on the sheet.</li>
                <li>Mark your attendance and write down your Roll No. and OMR sheet No. on the attendance sheet provided
                    to you in the examination hall.</li>
                <li>Do not overwrite or mark multiple answers. Ensure that circles on the OMR are filled completely.
                </li>
                <li>Do not signal or talk to any other candidate. Any non-compliance will result in disqualification
                    from appearing in the test.</li>
            </ol>
        @elseif($data['program_id'] == 41 || $data['program_id'] == 49 || $data['program_id'] == 72)
            <p><strong>General Instructions:</strong></p>
            <ol>
                <li>Bring your CNIC, admit card, and paid fee voucher for the test.</li>
                <li>Make sure you reach the test venue at <strong>09:00 AM sharp</strong>.</li>
                <li>Once inside the test venue, mark your attendance at the registration desk and follow the
                    instructions.</li>
                <li>Once the test is complete, remain seated until guided otherwise by the invigilation staff. Your
                    interview will be conducted on the same day and venue.</li>
                <li>You will be provided with an Optical Mark Reader (OMR) sheet at the start of the test. Mark your
                    test roll number on it. You may use a blue or black ball pen or lead pencil to mark your roll number
                    and answers on the sheet.</li>
                <li>Do not overwrite or mark multiple answers. Ensure that the circles on the OMR are filled completely.
                </li>
                <li>Do not signal or talk to any other candidate. Any non-compliance will result in disqualification
                    from appearing in the test.</li>
                <li>Please bring stationery (clipboard, pencil, or ball pen to fill the OMR sheet).</li>
                <li>Make sure to bring your CNIC, Matric, and FSc result cards and/or equivalence certificate for the
                    interview.</li>
            </ol>

            <p><strong>Test Pattern:</strong></p>
            <ol>
                <li>The test comprises 100 MCQs to be completed within 2 hours.</li>
                <li>All questions carry equal marks (1 mark each). There is <strong>NO negative marking</strong> in the
                    paper.</li>
            </ol>
        @else
            <p><strong>General Instructions:</strong></p>
            <ol>
                <li>Bring your original CNIC/B-Form, admit card & paid fee voucher for the test.</li>
                <li>Make sure you reach test venue at sharp 09:00 AM.</li>
                <li>Once inside the test venue mark your attendance on the registration desk and follow the instructions
                    to
                    find the seat marked with your test roll no.</li>
                <li>Once the test is complete, remain seated until otherwise guided by invigilation staff.</li>
                <li>You would be provided an Optical Mark Reader (OMR) sheet at the start of the test. Mark your test
                    roll
                    no on it. You may use any blue or black ball pen/lead pencil to mark your roll number and the
                    answers on
                    the sheet.</li>
                <li>Mark your attendance and write down your roll no and OMR sheet no on the attendance sheet provided
                    to
                    you in the examination hall.</li>
                <li>Do not overwrite or mark multiple answers. Ensure that circles on the OMR are filled completely.
                </li>
                <li>Do not signal or talk to any other candidate. Any non-compliance would result in disqualification to
                    appear in the test.</li>
                <li>Please bring stationary (Clipboard, Pencil, and black ball pen to fill the OMR Sheet).</li>
            </ol>
        @endif
        @if (
            $data['program_id'] == 35 &&
                $data['program_id'] != 20 &&
                $data['program_id'] != 21 &&
                $data['program_id'] != 22 &&
                $data['program_id'] != 23 &&
                $data['program_id'] != 41)
            <p><strong>General Instructions:</strong></p>
            <ol>
                <li>Bring your original CNIC/B-Form, admit card & paid fee voucher for the test.</li>
                <li>Make sure you reach test venue at sharp.</li>
                <li>Once inside the test venue mark your attendance on the registration desk and follow the instructions
                    to
                    find the seat marked with your test roll no.</li>
                <li>Once the test is complete, remain seated until otherwise guided by invigilation staff.</li>
                <li>You would be provided an Optical Mark Reader (OMR) sheet at the start of the test. Mark your test
                    roll
                    no on it. You may use any blue or black ball pen/lead pencil to mark your roll number and the
                    answers on
                    the sheet.</li>
                <li>Mark your attendance and write down your roll no and OMR sheet no on the attendance sheet provided
                    to
                    you in the examination hall.</li>
                <li>Do not overwrite or mark multiple answers. Ensure that circles on the OMR are filled completely.
                </li>
                <li>Do not signal or talk to any other candidate. Any non-compliance would result in disqualification to
                    appear in the test.</li>
                <li>Please bring stationary (Clipboard, Pencil, and black ball pen to fill the OMR Sheet).</li>
            </ol>
        @endif
        <!-- <p><strong>Test Pattern:</strong></p>
            <ol>
                <li>The test comprises of 100 MCQ’s that are to be completed within 02 hours.</li>
                @if (
                    $data['program_id'] == 8 ||
                        $data['program_id'] == 23 ||
                        $data['program_id'] == 54 ||
                        $data['program_id'] == 55 ||
                        $data['program_id'] == 56 ||
                        $data['program_id'] == 64 ||
                        $data['program_id'] == 65 ||
                        $data['program_id'] == 66 ||
                        $data['program_id'] == 67 ||
                        $data['program_id'] == 68 ||
                        $data['program_id'] == 69)
<li>The test comprises of 04 sections -English, Science, Math, and Analytical Reasoning..</li>
@endif
                <li>All questions carry equal marks (1 mark each). There is <b>NO negative marking</b> in the paper.
                </li>
            </ol>  -->
        @if (
            $data['program_id'] == 20 ||
                $data['program_id'] == 21 ||
                $data['program_id'] == 22 ||
                $data['program_id'] == 23 ||
                $data['program_id'] == 54 ||
                $data['program_id'] == 55 ||
                $data['program_id'] == 56 ||
                $data['program_id'] == 64 ||
                $data['program_id'] == 65 ||
                $data['program_id'] == 66 ||
                $data['program_id'] == 67 ||
                $data['program_id'] == 68 ||
                $data['program_id'] == 69)
            <p><strong>Note:</strong></p>
            <ul>
                <li>Electronic gadgets / mobiles/calculator are not allowed.</li>
            </ul>
        @elseif($data['program_id'] == 49)
            <p><strong>Note:</strong></p>
            <ul>
                <li>Entry without an admit card and CNIC is not allowed.</li>
                <li>Electronic gadgets, mobiles, and calculators are not allowed.</li>
                <li>Relatives or family members are <strong>NOT</strong> allowed inside the test campus.</li>
            </ul>
        @elseif($data['program_id'] == 41)
            <p><strong>Note:</strong></p>
            <ul>
                <li>Entry without Admit card &amp; CNIC is not allowed.</li>
                <li>Electronic gadgets/mobiles/calculator are not allowed.</li>
                <li>For location of the test venue visit the mentioned link: https://maps.app.goo.gl/kSL9MbhnJBC35SCr7
                </li>
            </ul>
        @elseif($data['program_id'] == 72)
            <p><strong>Note:</strong></p>
            <ul>
                <li>Entry without Admit card &amp; CNIC is not allowed.</li>
                <li>Electronic gadgets/mobiles/calculator are not allowed.</li>
                <li>For location of the test venue visit the mentioned link: https://maps.app.goo.gl/kSL9MbhnJBC35SCr7
                </li>
            </ul>
        @else
            <p><strong>Note:</strong></p>
            <ul>
                <li>Entry without Admit card & CNIC is not allowed.</li>
                <li>Electronic gadgets / mobiles/calculator are not allowed.</li>
                <li>Relatives OR Family members are NOT allowed inside the test campus.</li>
            </ul>
        @endif
        <!-- @if (
            $data['program_id'] != 8 ||
                $data['program_id'] == 54 ||
                $data['program_id'] == 55 ||
                $data['program_id'] == 56 ||
                $data['program_id'] == 64 ||
                $data['program_id'] == 65 ||
                $data['program_id'] == 66 ||
                $data['program_id'] == 67 ||
                $data['program_id'] == 68)
<hr>

            <h3>Routes to STMU Park Road Campus (Near Comsats)</h3>
            <ul>
                <li>
                    <strong>Route 1:</strong> Faizabad -> Rawal Dam Chowk -> Park Road (Chak Shahzad) -> STMU (Near
                    Comsats)
                    <br>
                    <a href="https://maps.app.goo.gl/AtoE7tSE5udhhnrE7" target="_blank">View on Google Maps</a>
                    <br>
                    <br>

                </li>
                <li>
                    <strong>Route 2:</strong> Serena Chowk -> Rawal Dam Chowk -> NIH -> NARC -> Park Road (Chak Shahzad)
                    -> STMU (Near Comsats)
                    <br>
                    <a href="https://maps.app.goo.gl/h65Am71vxgydQKAMA" target="_blank">View on Google Maps</a>
                    <br>
                    <br>

                </li>
                <li>
                    <strong>Route 3:</strong> Khanapul -> Burma Town -> Tarlai -> Taramari Chowk -> Park Road (Chak
                    Shahzad) -> STMU (Near Comsats)
                    <br>
                    <a href="https://maps.app.goo.gl/tDhvs3m38p4kUg1L6" target="_blank">View on Google Maps</a>
                    <br>
                    <br>

                </li>
            </ul>
@endif -->



    </div>

</body>

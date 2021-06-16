!include "D:\Program Files (x86)\NSIS\Include\EnvVarUpdate.nsh"
!include "MUI2.nsh"
!include "nsDialogs.nsh"
!include "LogicLib.nsh"

Var Dialog
Var UserLabel
Var UserText
Var UserState
var PostgreState
var PostgreVersion
var PostgreReqVersion

;--------------------------------
; Show install details
    ShowInstDetails show

;--------------------------------
;Interface Settings

    !define MUI_ABORTWARNING
    !define MUI_PAGE_HEADER_TEXT "Welcome to Mint CRM"
    !define MUI_PAGE_HEADER_SUBTEXT "This software is developed for Mint Cleaning Services as a CRM solution. By Youssef Hany Aref. Please read the Lisence."
     
Page custom nsDialogsPage 

Function nsDialogsPage
    
    
    call PG_Check

    ; nsDialogs::Create 1018
    ; !insertmacro MUI_HEADER_TEXT "Set Configurations" "Please set the following preferences. Note that they will not be changed through the application, but from the database itself."
    ; Pop $Dialog
   
    ; ${If} $Dialog == error
    ;     Abort
    ; ${EndIf}

    ; ${NSD_CreateLabel} 0 0 100% 12u "Please provide Hospital/Clinic's name:"
    ; Pop $UserLabel

    ; ${NSD_CreateText} 0 13u 100% 12u $UserState
    ; Pop $UserText

    ; nsDialogs::Show

FunctionEnd

; Function nsDialogsPageLeave

;     ${NSD_GetText} $UserText $UserState

;     ${If} $UserState == ""
;         MessageBox MB_OK "Cannot submit empty Hospital/Clinic's name!"
;         Abort
;     ${EndIf}

;     StrCpy $4 $UserState

;     Delete "C:\HMS_data\hospital_name.json"
;     RMDir "C:\HMS_data"
;     CreateDirectory "C:\HMS_data"
;     FileOpen $9 "C:\HMS_data\hospital_name.json" w
;     FileWrite $9 {"hName":"$4"}
;     FileClose $9

   
    
; FunctionEnd


Function PG_Check
    StrCpy $PostgreReqVersion 12
    push 0 ;required as an argument (doesnt matter the variable itself) in DetectPostgreSQL Function without it error invalid opcode occurs
    call DetectPostgreSQL

    ${If} $PostgreState == "0" ;0 not found
        MessageBox MB_YESNO "PostgreSQL was not found. If you want to install press YES, if this is a client then please press NO" IDYES true1 IDNO false1
        true1:
            MessageBox MB_OK "Run the installer after downloading and installing PostgreSQL"
            ExecShell open "https://www.postgresql.org/download/windows/" 
            Quit
        false1:
            MessageBox MB_OK "Resuming installation without PostgreSQL."

    ${ElseIf} $PostgreState == "-1" ;-1 found old version of postgres
        MessageBox MB_YESNO "Found an old version $PostgreVersion of PostgreSQL do you want to install newer version?" IDYES true2 IDNO false2
        true2:
            MessageBox MB_OK "Run the installer after initializing the new database"
            ExecShell open "https://www.postgresql.org/download/windows/"
            Quit
        false2:
            MessageBox MB_OK "Continuing installation on current version of PostgreSQL."
    ${Else} ;1 found a new or same provided version of postgres
        MessageBox MB_OK "Found Postgresql Version $PostgreVersion continuing installation."
    ${EndIf}
FunctionEnd

; Returns: 0 - PostgreSQL not found. -1 - PostgreSQL found but too old. Otherwise - PostgreSQL version
; DetectPostgreSQL. Version requested is on the stack.
; Returns (on stack) "0" on failure (java too old or not installed), otherwise path to java interpreter
; Stack value will be overwritten!
Function DetectPostgreSQL
    Exch $0 ; Get version requested
    ; Now the previous value of $0 is on the stack, and the asked for version of JDK is in $0
    Push $1 ; $1 = PostgreSQL version string (ie 8.2)
    Push $2 ; $2 = registry key

    ; scan through all installs to get the highest version
    StrCpy $0 0
    DetectPostgreSQLLoop:
    EnumRegKey $2 HKLM "Software\PostgreSQL\Installations" $0
    StrCmp $2 "" DetectPostgreSQLDone
    ReadRegStr $1 HKLM "Software\PostgreSQL\Installations\$2" "Version"
    ReadRegStr $3 HKLM "Software\PostgreSQL\Installations\$2" "Base Directory"
    IntOp $0 $0 + 1
    goto DetectPostgreSQLLoop
    DetectPostgreSQLDone:
    StrCmp $1 "" NoFound
    IntCmp $1 $PostgreReqVersion FoundNew FoundOld FoundNew

    NoFound:
    Push "0"
    StrCpy $PostgreState "0"
    Goto DetectPostgreSQLEnd
    FoundOld:
    Push "-1"
    StrCpy $PostgreState "-1"
    StrCpy $PostgreVersion $1
    Goto DetectPostgreSQLEnd
    FoundNew:
    Push "1"
    StrCpy $PostgreState "1"
    StrCpy $PostgreVersion $1
    Goto DetectPostgreSQLEnd
    DetectPostgreSQLEnd:
    ; Top of stack is return value, then r4,r3,r2,r1
    Exch ; => r2,rv,r1,r0
    Pop $2 ; => rv,r1,r0
    Exch ; => r1,rv,r0
    Pop $1 ; => rv,r0
    Exch ; => r0,rv
    Pop $0 ; => rv
FunctionEnd


Section
SectionEnd


!macro customHeader
    
!macroend

!macro preInit
    
!macroend

!macro customInstall
    ${EnvVarUpdate} $1 "PATH" "A" "HKLM" "$INSTDIR"

!macroend

!macro customUnInstall
    ${un.EnvVarUpdate} $1 "PATH" "R" "HKLM" "$INSTDIR"
!macroend


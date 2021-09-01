import { assemble } from '../../src/features/assembler/core'
import { initDataFrom } from '../../src/features/memory/core'

const INPUT = `
; --------------------------------------------------------------
; An example of using hardware interrupts.
; This program spins the stepper motor continuously and
; steps the traffic lights on each hardware interrupt.

; Uncheck the "Show only one peripheral at a time" box
; to enable both displays to appear simultaneously.

; --------------------------------------------------------------
	JMP	Start	; Jump past table of interrupt vectors
	DB	50	; Vector at 02 pointing to address 50

Start:
	STI		; Set I flag. Enable hardware interrupts
	MOV	AL, 11	;
Rep:
	OUT	05	; Stepper motor
	ROR	AL	; Rotate bits in AL right
	JMP	Rep
	JMP	Start
; --------------------------------------------------------------
	ORG	50

	PUSH	al	; Save AL onto the stack.
	PUSH	bl	; Save BL onto the stack.
	PUSHF		; Save flags onto the stack.

	JMP	PastData

	DB	84	; Red		Green
	DB	c8	; Red+Amber	Amber
	DB	30	; Green		Red
	DB	58	; Amber		Red+Amber
	DB	57	; Used to track progress through table
PastData:
	MOV	BL,[5B]	; BL now points to the data table
	MOV	AL,[BL]	; Data from table goes into AL
	OUT	01	; Send AL data to traffic lights
	CMP	AL,58	; Last entry in the table
	JZ	Reset	; If last entry then reset pointer

	INC	BL	; BL points to next table entry
	MOV	[5B],BL	; Save pointer in RAM
	JMP	Stop
Reset:
	MOV	BL,57	; Pointer to data table start address
	MOV	[5B],BL	; Save pointer into RAM location 54
Stop:
	POPF		; Restore flags to their previous value
	POP	bl	; Restore BL to its previous value
	POP	al	; Restore AL to its previous value

	IRET
; --------------------------------------------------------------

END
; --------------------------------------------------------------
`

const RESULT_MEMORY_DATA = [
  0xc0, 0x03, 0x50, 0xfc, 0xd0, 0x00, 0x11, 0xf1, 0x05, 0x9b, 0x00, 0xc0, 0xfc, 0xc0, 0xf6, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0xe0, 0x00, 0xe0, 0x01, 0xea, 0xc0, 0x07, 0x84, 0xc8, 0x30, 0x58, 0x57, 0xd1, 0x01, 0x5b, 0xd3,
  0x00, 0x01, 0xf1, 0x01, 0xdb, 0x00, 0x58, 0xc1, 0x09, 0xa4, 0x01, 0xd2, 0x5b, 0x01, 0xc0, 0x08,
  0xd0, 0x01, 0x57, 0xd2, 0x5b, 0x01, 0xeb, 0xe1, 0x01, 0xe1, 0x00, 0xcd, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
  0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,
  0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,
  0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20,
  0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20, 0x20
]

describe('assembler', () => {
  it('should assemble correctly', () => {
    const [addressToMachineCodeMap] = assemble(INPUT)
    expect(initDataFrom(addressToMachineCodeMap)).toEqual(RESULT_MEMORY_DATA)
  })

  it('should throw DuplicateLabelError', () => {
    expect(() => {
      assemble(`
start: inc al
start: dec bl
end
`)
    }).toThrowError('Duplicate label: START')
  })

  it('should throw EndOfMemoryError', () => {
    expect(() => {
      assemble(`
org ff
inc al
end
`)
    }).toThrowError('Can not generate code beyond the end of RAM')
  })

  it('should throw LabelNotExistError', () => {
    expect(() => {
      assemble('jmp start end')
    }).toThrowError('Label does not exist: start')
  })

  it('should throw JumpDistanceError', () => {
    expect(() => {
      assemble(`
start:
inc al
org fd
jmp start
end
`)
    }).toThrowError('Jump distance should be between -128 and 127: start')
  })
})

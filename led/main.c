
// *****************************************************************************
// * SWITCHES_0
// *****************************************************************************
#define SWITCHES_0_BASE	(0xf0000dac)
#define SWITCHES_0_SIZE	(0x4)
#define SWITCHES_0_N	(0x8)


// *****************************************************************************
// * LED_MATRIX_0
// *****************************************************************************
#define LED_MATRIX_0_BASE	(0xf0000000)
#define LED_MATRIX_0_SIZE	(0xdac)
#define LED_MATRIX_0_WIDTH	(0x23)
#define LED_MATRIX_0_HEIGHT	(0x19)
int abc;
unsigned* led_base = (unsigned*) LED_MATRIX_0_BASE;
unsigned* switch_base = (unsigned*) SWITCHES_0_BASE;

void main() {    
    unsigned v = 0;
    while (1) {
        abc++;
        for (int i = 0; i < SWITCHES_0_N; i++) {
            if ((*switch_base >> i) & 0x1) {
                *(led_base + i) = 0xFF00FF ;//<< ((i % 3) * 8);
            } else {
                *(led_base + i) = 0x0;
            }
        }
    }
}
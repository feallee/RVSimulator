char tab[] = { 0x3F,0x06,0x5B,0x4F,0x66,0x6D,0x7D,0x07,0x7F,0x6F,0 };
volatile char* led = ( char* ) 0xf0000000;
int main(void)
{
    char i = 0;
    while (1)
    {       
        *led = tab[i++];
        if (i > 9)
        {
            i = 0;
        }
    }
}
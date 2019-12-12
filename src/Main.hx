package;

using hxColorToolkit.ColorToolkit;

class Main {
    public static function main() {
        var hexColor = 0x112233.toHex();
        trace(hexColor.red); //0x11
        trace(hexColor.green); //0x22
        trace(hexColor.blue); //0x33

        var hslColor = new hxColorToolkit.spaces.HSL(0, 100, 50); //construct a color in HSL space
        trace(hslColor.getColor()); //0xFF0000 the hex color value
    }
}
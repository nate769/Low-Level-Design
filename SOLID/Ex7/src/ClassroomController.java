public class ClassroomController {
    private final DeviceRegistry reg;

    public ClassroomController(DeviceRegistry reg) {
        this.reg = reg;
    }

    public void startClass() {
        Connectable pj = reg.getConnectable("Projector");
        pj.powerOn();
        pj.connectInput("HDMI-1");

        Dimmable lights = reg.getDimmable("LightsPanel");
        lights.setBrightness(60);

        TemperatureControllable ac = reg.getTemperatureControllable("AirConditioner");
        ac.setTemperatureC(24);

        Scannable scan = reg.getScannable("AttendanceScanner");
        System.out.println("Attendance scanned: present=" + scan.scanAttendance());
    }

    public void endClass() {
        System.out.println("Shutdown sequence:");
        reg.getDevice("Projector").powerOff();
        reg.getDevice("LightsPanel").powerOff();
        reg.getDevice("AirConditioner").powerOff();
    }
}

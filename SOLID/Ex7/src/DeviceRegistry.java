import java.util.*;

public class DeviceRegistry {
    private final List<Switchable> switchables = new ArrayList<>();
    private final List<Connectable> connectables = new ArrayList<>();
    private final List<Dimmable> dimmables = new ArrayList<>();
    private final List<Scannable> scannables = new ArrayList<>();
    private final List<TemperatureControllable> temperatureControllables = new ArrayList<>();

    public void add(SmartClassroomDevice d) {
        if (d instanceof Switchable switchable)
            switchables.add(switchable);
        if (d instanceof Connectable connectable)
            connectables.add(connectable);

        if (d instanceof TemperatureControllable temperatureControllable)
            temperatureControllables.add(temperatureControllable);

        if (d instanceof Dimmable dimmable)
            dimmables.add(dimmable);

        if (d instanceof Scannable scannable)
            scannables.add(scannable);

    }

    // public SmartClassroomDevice getFirstOfType(String simpleName) {
    // for (SmartClassroomDevice d : devices) {
    // if (d.getClass().getSimpleName().equals(simpleName))
    // return d;
    // }
    // throw new IllegalStateException("Missing: " + simpleName);
    // }

    public Connectable getConnectable(String simpleName) {
        for (Connectable connectable : connectables) {
            if (connectable.getClass().getSimpleName().equals(simpleName))
                return connectable;
        }
        throw new IllegalStateException("Missing: " + simpleName);
    }

    public Switchable getSwitchable(String simpleName) {
        for (Switchable switchable : switchables) {
            if (switchable.getClass().getSimpleName().equals(simpleName))
                return switchable;
        }
        throw new IllegalStateException("Missing: " + simpleName);
    }

    public Dimmable getDimmable(String simpleName) {
        for (Dimmable dimmable : dimmables) {
            if (dimmable.getClass().getSimpleName().equals(simpleName))
                return dimmable;
        }
        throw new IllegalStateException("Missing: " + simpleName);
    }

    public TemperatureControllable getTemperatureControllable(String simpleName) {
        for (TemperatureControllable temperatureControllable : temperatureControllables) {
            if (temperatureControllable.getClass().getSimpleName().equals(simpleName))
                return temperatureControllable;
        }
        throw new IllegalStateException("Missing: " + simpleName);
    }

    public Scannable getScannable(String simpleName) {
        for (Scannable scannable : scannables) {
            if (scannable.getClass().getSimpleName().equals(simpleName))
                return scannable;
        }
        throw new IllegalStateException("Missing: " + simpleName);
    }

    public SmartClassroomDevice getDevice(String simpleName) {
        for (Connectable device : connectables)
            if (device.getClass().getSimpleName().equals(simpleName))
                return device;
        for (Dimmable device : dimmables)
            if (device.getClass().getSimpleName().equals(simpleName))
                return device;
        for (Scannable device : scannables)
            if (device.getClass().getSimpleName().equals(simpleName))
                return device;
        for (TemperatureControllable device : temperatureControllables)
            if (device.getClass().getSimpleName().equals(simpleName))
                return device;
        for (Switchable device : switchables)
            if (device.getClass().getSimpleName().equals(simpleName))
                return device;

        throw new IllegalStateException("Missing: " + simpleName);
    }

}
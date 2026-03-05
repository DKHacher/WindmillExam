using System;
using System.Collections.Concurrent;
using System.Threading.Tasks;

public interface IMqttCommandService
{
    Task SendCommandAsync(string turbineId, string action, string args);
    void RegisterHandler(Func<string, string, string, Task> handler);
}

public class MqttCommandService : IMqttCommandService
{
    private Func<string, string, string, Task>? _handler;

    public void RegisterHandler(Func<string, string, string, Task> handler)
    {
        _handler = handler;
    }

    public async Task SendCommandAsync(string turbineId, string action, string args)
    {
        if (_handler == null)
            throw new InvalidOperationException("No handler registered for commands.");

        await _handler(turbineId, action, args);
    }
}
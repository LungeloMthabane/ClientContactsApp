using System.Text.RegularExpressions;

namespace clientContactsApp.Domain.Services;

public static class ClientCodeGenerator
{
    public static string Generate(string clientName, IEnumerable<string> existingCodes)
    {
        var prefix = GeneratePrefix(clientName);

        var nextNumber = GetNextNumber(prefix, existingCodes);

        return $"{prefix}{nextNumber:000}";
    }

    private static string GeneratePrefix(string name)
    {
        name = name.Trim().ToUpper();

        var words = Regex.Split(name, @"\s+")
            .Where(w => !string.IsNullOrWhiteSpace(w))
            .ToArray();

        string prefix;

        if (words.Length >= 3)
        {
            prefix = string.Concat(words.Select(w => w[0])).Substring(0, 3);
        }
        else if (words.Length == 2)
        {
            prefix = $"{words[0][0]}{words[1][0]}{words[1].ElementAtOrDefault(1)}";
        }
        else
        {
            prefix = words[0].Length >= 3
                ? words[0].Substring(0, 3)
                : words[0];
        }

        return PadToThree(prefix);
    }

    private static string PadToThree(string prefix)
    {
        const string alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        int i = 0;

        while (prefix.Length < 3)
        {
            prefix += alphabet[i++];
        }

        return prefix;
    }

    private static int GetNextNumber(string prefix, IEnumerable<string> existingCodes)
    {
        var numbers = existingCodes
            .Where(c => c.StartsWith(prefix))
            .Select(c => int.Parse(c.Substring(3)))
            .DefaultIfEmpty(0);

        return numbers.Max() + 1;
    }
}
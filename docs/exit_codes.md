# Exit codes

All exit codes in this program have special meaning. The following table lists
the exit codes and their meanings. Note that we try to follow C/C++ exit code
conventions. A description of those conventions can be found [here][meanings].

| Exit Code | Meaning |
| ---: | --- |
| 64 | `config.toml` not found. Please fill it out. |
| 65 | `config.toml` parsing error. Please verify that it's correct. |
| 66 | Could not connect to MongoDB server. |
| 67 | Could not authenticate against NEU. |
| 68 | Error while reading cached files. Try clearing `cache/`. |

[meanings]: http://tldp.org/LDP/abs/html/exitcodes.html

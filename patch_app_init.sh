sed -i '/return '\'home\'';/c\
        // Check if the intro has already played in this tab/session\n        const introPlayedInTab = sessionStorage.getItem('\''undergroundz_intro_played'\'');\n        if (!introPlayedInTab) {\n          sessionStorage.setItem('\''undergroundz_intro_played'\'', '\''true'\'');\n          return '\''intro'\'';\n        }\n        return '\''home'\'';' src/App.tsx

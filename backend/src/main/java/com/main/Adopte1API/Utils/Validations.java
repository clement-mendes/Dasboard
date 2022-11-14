package com.main.Adopte1API.Utils;

import java.util.regex.Pattern;

public class Validations {
    public static boolean isEmail(String email) {
        return Pattern.matches("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$", email);
    }
}

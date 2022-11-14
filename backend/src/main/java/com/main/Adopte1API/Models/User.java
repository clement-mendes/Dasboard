package com.main.Adopte1API.Models;

public class User {
    public User(Integer id, String email, String firstName, String lastName) {
        this.id = id;
        this.email = email;
        this.first_name = firstName;
        this.last_name = lastName;
    }
    private Integer id;
    private String last_name;

    public String getFirst_name() {
        return first_name;
    }

    public void setFirst_name(String first_name) {
        this.first_name = first_name;
    }

    private String first_name;
    private String email;



    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getLastName() {
        return this.last_name;
    }

    public void setLastName(String name) {
        this.last_name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}

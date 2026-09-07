package com.localservicefinder.enums;

// Deliberately smaller than the full Role enum (which also has ADMIN).
// A registration request can only ever be one of these two — there is
// no value that maps to ADMIN, so the bug we found in the other repo
// (anyone can register as ADMIN) is structurally impossible here.
public enum RegistrationRole {
    CUSTOMER,
    PROVIDER
}
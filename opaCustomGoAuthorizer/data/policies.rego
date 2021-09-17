package opademo

default allow=false

allow {
    input.Usergroup == data.GroupPermissions[input.Resource][_]
}
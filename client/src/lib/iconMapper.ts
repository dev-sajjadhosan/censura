import { Home, LayoutDashboard, User, Settings, Calendar, Clock, FileText, Star, Shield, Stethoscope, Users, Hospital, CalendarClock, CreditCard, ClipboardList, Activity, CalendarDays, Bookmark, LogOut, ListVideo } from "lucide-react";

export const getIconComponent = (iconName : string) => {
    switch (iconName) {
        case "Home":
            return Home;
        case "LayoutDashboard":
            return LayoutDashboard;
        case "User":
            return User;
        case "Settings":
            return Settings;
        case "Calender":
            return Calendar;
        case "Clock":
            return Clock;
        case "FileText":
            return FileText;
        case "Star":
            return Star;
        case "Shield":
            return Shield;
        case "Stethoscope":
            return Stethoscope;
        case "Users":
            return Users;
        case "Hospital":
            return Hospital;
        case "CalendarClock":
            return CalendarClock;
        case "CreditCard":
            return CreditCard;
        case "Calendar":
            return Calendar;
        case "ClipboardList":
            return ClipboardList;
        case "Activity":
            return Activity;
        case "CalendarDays":
            return CalendarDays;
        case "ListVideo":
            return ListVideo;
        case "Bookmark":
            return Bookmark;
        case "LogOut":
            return LogOut;
        default:
            return Home;
    }
}
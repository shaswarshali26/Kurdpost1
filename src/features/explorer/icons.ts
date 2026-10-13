import {
  Baby, Banknote, BookOpen, Building, Building2, Bus, Cable, Camera, Car, Castle, Church, Coins,
  CreditCard, Droplet, Droplets, Factory, Flame, Fuel, Globe, GraduationCap, HeartPulse, Home,
  Hospital, Hotel, Landmark, LayoutGrid, Library, Mail, Map, MapPin, Milestone, Moon, Pill, Plane,
  Plug, Route, Satellite, Scale, School, Shield, ShoppingBag, ShoppingCart, Smile, Sparkles,
  Stethoscope, Store, Sun, TrainFront, TrainTrack, Trees, Waves, Waypoints, Wheat, Zap,
  type LucideIcon,
} from 'lucide-react';

const ICONS: Record<string, LucideIcon> = {
  Baby, Banknote, BookOpen, Building, Building2, Bus, Cable, Camera, Car, Castle, Church, Coins,
  CreditCard, Droplet, Droplets, Factory, Flame, Fuel, Globe, GraduationCap, HeartPulse, Home,
  Hospital, Hotel, Landmark, LayoutGrid, Library, Mail, Map, MapPin, Milestone, Moon, Pill, Plane,
  Plug, Route, Satellite, Scale, School, Shield, ShoppingBag, ShoppingCart, Smile, Sparkles,
  Stethoscope, Store, Sun, TrainFront, TrainTrack, Trees, Waves, Waypoints, Wheat, Zap,
};

export function iconFor(name: string): LucideIcon {
  return ICONS[name] ?? MapPin;
}

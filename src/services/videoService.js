import { createClient } from "@supabase/supabase-js";

const PROJECT_URL = "https://zwsndgmbsdgjescqjpjh.supabase.co"
const PUBLIC_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3c25kZ21ic2RnamVzY3FqcGpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjgxODI1MzAsImV4cCI6MTk4Mzc1ODUzMH0.BXUkUctSuQn_Sujps3cEXJK4TRiO6ZilNQwl1DXWsJ8"

export const supabase = createClient(PROJECT_URL, PUBLIC_KEY)

export function videoService() {
    return {
        getAllVideos() {
            return supabase.from("videos")
                .select("*");
        }
    }
}
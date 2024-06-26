import axios from '../../utils/axios';




export const getUpcoming = async() => {
    try{
        const classroom = await axios.get('/get-classrooms');
        return classroom.data;
    
        }catch (error: any){
            return error.message
        }
}

export const getMentorship = async() => {
    try{
        const classroom = await axios.get('/get-mentorship');
        return classroom.data;
    
        }catch (error: any){
            return error.message
        }
}

export const getAssignment = async() => {
    try{
        const classroom = await axios.get('/get-assignments');
        return classroom.data;
    
        }catch (error: any){
            return error.message
        }
}

export const getSubmissionList = async() => {
    try{
        const submissions = await axios.get('/submissions');
        return submissions.data;
    
        }catch (error: any){
            return error.message
        }
}

export const markAttendance = async(id: any) => {
    try{
        const attendance = await axios.put('/mark-attendance/'+id);
        return attendance.data;
    
        }catch (error: any){
            return error.message
        }
}

export const createSubmission = async(data: any) => {
    try{
        const attendance = await axios.post('/submissions', data);
        return attendance.data;
    
        }catch (error: any){
            return error.message
        }
}

export const getAdmission = async() => {
    try{
        const letter = await axios.get('/get-admission-letter');
        return letter.data;
    
        }catch (error: any){
            return error.message
        }
}
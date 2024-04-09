import axios from '../../utils/axios';


export const fetchAllClassrooms = async() => {
    try{
    const classrooms = await axios.get('/classroom');
    return classrooms.data;

    }catch (error: any){
        return error.message
    }
}

export const createClassroom = async(data: any) => {
    try{
        const classroom = await axios.post('/classroom', data);
        return classroom.data;
    
        }catch (error: any){
            return error.message
        }
}
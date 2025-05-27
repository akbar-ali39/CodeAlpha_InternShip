import axios from "axios";

 const fetchPrompt=async(type="truth")=>{
    try {
const response = await axios.get(`https://api.truthordarebot.xyz/v1/${type}`);
        return response.data.question;
    } catch (error) {
        console.error('Error fetcing prompt:',error.message);
        return 'Something went wroung. Try again';
    }
}

export default fetchPrompt;
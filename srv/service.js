const cds = require('@sap/cds');
module.exports = cds.service.impl(
    async function() { 
        const{ uploadLogFileReturn } = this.entities;
        this.entities('CREATE', uploadLogFileReturn, async (req) => {  
            let result;
            let file;
            let parameters = {};
        
            parameters.FILENAME = req.data.FILENAME;
            parameters.USER = req.data.USER;
            parameters.COMMENT = req.data.COMMENT;
        
            // Step 1: OCR process using Vision AI
            const fileContent = req.data.FILECONTENT; // Assuming this is the image data
        
            // Call Vision AI service for OCR
            const visionAIResponse = await performOCRWithVisionAI(fileContent);
        
            // Step 2: Extract order number from OCR result
            const ocrText = visionAIResponse.text; // Assuming the response contains text field with OCR result
            const orderNumber = extractOrderNumberFromText(ocrText);
        
            // You can now use the extracted order number as needed
            parameters.ORDER_NO = orderNumber;
        
            // Step 3: Proceed with upload or further processing
            result = await uploadLogFileReturn(req.data.FILECONTENT, parameters);
        
            return result;
        });
        
        // Helper function to call Vision AI for OCR
            async function performOCRWithVisionAI(imageData) {
                try {
                    // Vision API URL and API key
                    const visionApiUrl = 'https://vision.googleapis.com/v1/images:annotate';
                    const apiKey = 'YOUR_API_KEY_HERE'; // Replace with your actual Vision AI API key

                    // Vision API request payload
                    const requestBody = {
                        requests: [
                            {
                                image: {
                                    content: imageData // Base64-encoded image data
                                },
                                features: [
                                    {
                                        type: 'TEXT_DETECTION'
                                    }
                                ]
                            }
                        ]
                    };

                    // Make the HTTP POST request to Vision AI
                    const response = await axios.post(`${visionApiUrl}?key=${apiKey}`, requestBody, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });

                    // Return the response from Vision AI
                    if (response.data && response.data.responses) {
                        return response.data.responses[0].fullTextAnnotation || {};
                    } else {
                        throw new Error('Invalid response from Vision AI');
                    }
                } catch (error) {
                    console.error('Error calling Vision AI:', error);
                    throw error;
                }
            }

            // Helper function to extract the order number from OCR text
            function extractOrderNumberFromText(text) {
                // Use regex or other pattern matching logic to find the order number
                const orderNumberPattern = /\bOrder No: (\d+)\b/i;
                const match = text.match(orderNumberPattern);
                return match ? match[1] : null;
            }
     });
   
 
   

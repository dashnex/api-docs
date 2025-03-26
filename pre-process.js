// AI GENERATED CODE ¯ \ _ (ツ) _ / ¯ 

const fs = require('fs');
const path = require('path');

// Function to sort parameters by required status and then alphabetically
function sortParameters(parameters) {
    return [...parameters].sort((a, b) => {
        // Required parameters go first
        if (a.required && !b.required) return -1;
        if (!a.required && b.required) return 1;
        // If both are required or both are not required, sort alphabetically by name
        return a.name.localeCompare(b.name);
    });
}

// Function to sort methods alphabetically
function sortMethods(pathItem) {
    const sortedMethods = {};
    Object.keys(pathItem)
        .sort((a, b) => a.localeCompare(b))
        .forEach(method => {
            sortedMethods[method] = pathItem[method];
        });
    return sortedMethods;
}

// Function to determine tags based on path
function determineTags(path, existingTags) {
    const tags = [];
    
    if (path.includes('/oauth/') && !path.startsWith('/oauth/')) {
        tags.push('oauth');
    }
    
    if (path.includes('/private')) {
        tags.push('private');
    } else {
        tags.push('public');
    }
    
    return tags;
}

// Function to process a single JSON file
function processJsonFile(filePath) {
    try {
        // Read and parse the JSON file
        const jsonContent = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        
        // Check if the file has servers array
        if (!jsonContent.servers || !Array.isArray(jsonContent.servers)) {
            console.log(`Warning: No servers array found in ${filePath}`);
            return;
        }

        // Create a map of existing servers by URL
        const existingServers = new Map(
            jsonContent.servers.map(server => [server.url, server])
        );

        const basePath = jsonContent.servers[0]?.variables?.basePath?.default;

        if (basePath) {
            // Define required servers with descriptions
            const requiredServers = [
                {
                    url: `https://api.dashnex.com/${basePath}`,
                    description: 'Production server'
                },
                {
                    url: `https://api.qa.dashnex.com/${basePath}`,
                    description: 'QA server'
                }
            ];

            // Process each required server
            const newServers = requiredServers.map(requiredServer => {
                // Check if server exists
                const existingServer = Array.from(existingServers.values()).find(
                    server => server.url.includes(requiredServer.url.split('/')[2])
                );

                if (existingServer) {
                    // If server exists, update its URL and remove variables
                    const { variables, ...serverWithoutVars } = existingServer;
                    return {
                        ...serverWithoutVars,
                        url: requiredServer.url,
                        // Keep existing description if it exists, otherwise use the required server's description
                        description: serverWithoutVars.description || requiredServer.description
                    };
                } else {
                    // If server doesn't exist, add it with description
                    return requiredServer;
                }
            });

            // Update the servers array
            jsonContent.servers = newServers;
        }

        // Process paths to sort parameters and methods
        if (jsonContent.paths) {
            const sortedPaths = {};
            Object.keys(jsonContent.paths)
                .sort((a, b) => a.localeCompare(b))
                .forEach(path => {
                    const pathItem = jsonContent.paths[path];
                    // Sort methods within each path
                    const sortedMethodsObj = sortMethods(pathItem);
                    // Sort parameters within each method and add tags
                    Object.keys(sortedMethodsObj).forEach(method => {
                        const methodItem = sortedMethodsObj[method];
                        if (methodItem.parameters && Array.isArray(methodItem.parameters)) {
                            methodItem.parameters = sortParameters(methodItem.parameters);
                        }
                        // Add tags to the method, using existing tags if available
                        methodItem.tags = determineTags(path, methodItem.tags);
                    });
                    sortedPaths[path] = sortedMethodsObj;
                });
            jsonContent.paths = sortedPaths;
        }

        // Write the modified content back to the file
        fs.writeFileSync(filePath, JSON.stringify(jsonContent, null, 2));
        console.log(`Successfully processed ${filePath}`);
    } catch (error) {
        console.error(`Error processing ${filePath}:`, error.message);
    }
}

// Function to process all JSON files in a directory
function processDirectory(directory) {
    try {
        // Read all files in the directory
        const files = fs.readdirSync(directory);

        // Process each JSON file
        files.forEach(file => {
            if (file.endsWith('.json')) {
                const filePath = path.join(directory, file);
                processJsonFile(filePath);
            }
        });
    } catch (error) {
        console.error(`Error reading directory ${directory}:`, error.message);
    }
}

// Process the public directory
const publicDir = path.join(__dirname, 'public');
processDirectory(publicDir); 
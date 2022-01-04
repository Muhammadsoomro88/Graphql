const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const { 
    GraphQLSchema, 
    GraphQLObjectType, 
    GraphQLNonNull, 
    GraphQLList, 
    GraphQLInt, 
    GraphQLString 
} = require('graphql')
const app = express()

const courses = [
    {id: 1, coursecode: 100, coursename: "Intro to computing"},
    {id: 2, coursecode: 101, coursename: "Programming fundamentals"},
    {id: 3, coursecode: 102, coursename: "English Language"},
    {id: 4, coursecode: 103, coursename: "Linear Algebra"},
    {id: 5, coursecode: 104, coursename: "Prob & Statistics"},
    {id: 6, coursecode: 105, coursename: "Theory of Automata"},
    {id: 7, coursecode: 106, coursename: "Design Patterns"},
    {id: 8, coursecode: 107, coursename: "Data Structures"},
    {id: 9, coursecode: 108, coursename: "Database"},
    {id: 10, coursecode: 109, coursename: "Information Security"},
]

const teachers = [
    {id: 1, name: "Sir A", post:"Associate Professor", teaches:100},
    {id: 2, name: "Sir B", post:"Associate Professor", teaches:101},
    {id: 3, name: "Sir C", post:"Assitant Professor", teaches:102},
    {id: 4, name: "Sir D", post:"Assitant Professor", teaches:103},
    {id: 5, name: "Sir E", post:"Associate Professor", teaches:104},
    {id: 6, name: "Sir F", post:"HOD", teaches:105},
    {id: 7, name: "Sir G", post:"Director", teaches:106},
    {id: 8, name: "Sir H", post:"Associate Professor", teaches:107},
    {id: 9, name: "Sir I", post:"Assitant Professor", teaches:108},
    {id: 10, name: "Sir J", post:"HOD", teaches:109},
]

const TeacherType = new GraphQLObjectType({
    name: 'Teacher',
    description: 'This represent a teacher in University',
    fields: () => ({
        id: {type: new GraphQLNonNull(GraphQLInt)},
        name: {type: new GraphQLNonNull(GraphQLString)},
        post: {type: new GraphQLNonNull(GraphQLString)},
        teaches: {type: new GraphQLNonNull(GraphQLInt)},
        course:{
            type: CourseType,
            resolve: (teacher) => {
                return courses.find(course => course.coursecode === teacher.teaches)
            }
        }
    })
})

const CourseType = new GraphQLObjectType({
    name: 'Course',
    description: 'This represents course',
    fields: () => ({
        id: {type: new GraphQLNonNull(GraphQLInt)},
        coursecode: {type: new GraphQLNonNull(GraphQLInt)},
        coursename: {type: new GraphQLNonNull(GraphQLString)},
        teacher:{
            type: TeacherType,
            resolve: (course) => {
                return teachers.find(teacher => teacher.teaches === course.coursecode)
            }
        }
    })
})

const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        teacher: {
            type: TeacherType,
            description: 'A Single Teacher',
            args: {
                id: {type: new GraphQLNonNull(GraphQLInt)}
            },
            resolve: (parent, args) => {
                return teachers.find(teacher => teacher.id === args.id)
            }
        },
        teachers:{
            type: new GraphQLList(TeacherType),
            description: 'Return all Teachers',
            resolve: () => teachers
        },
        course: {
            type: CourseType,
            description: 'A Single Course',
            args: {
                id: {type: new GraphQLNonNull(GraphQLInt)}
            },
            resolve: (parent, args) => {
                return courses.find(course => course.id === args.id)
            }
        },
        courses:{
            type: new GraphQLList(CourseType),
            description: 'Return all Courses',
            resolve: () => courses
        }
    })
})

const RootMutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Root Mutation',
    fields: () => ({
        addTeacher: {
            type: TeacherType,
            description: 'Add a Teacher',
            args: {
                name: {type: new GraphQLNonNull(GraphQLString)},
                post: {type: new GraphQLNonNull(GraphQLString)},
                teaches: {type: new GraphQLNonNull(GraphQLInt)},
            },
            resolve: (parent, args) => {
                const teacher = {id: teachers.length + 1 , name: args.name, post: args.post, teaches: args.teaches}
                teachers.push(teacher)
                return teacher
            }
        },
        addCourse: {
            type: CourseType,
            description: 'Add a Course',
            args: {
                coursecode: {type: new GraphQLNonNull(GraphQLInt)},
                coursename: {type: new GraphQLNonNull(GraphQLString)},
            },
            resolve: (parent, args) => {
                const course = {id: courses.length + 1 , coursecode: args.coursecode , coursename: args.coursename}
                courses.push(course)
                return course
            }
        },
        removeTeacher: {
            type: new GraphQLList(TeacherType),
            description: 'Remove a Teacher',
            args: {
                id: {type: new GraphQLNonNull(GraphQLInt)}
            },
            resolve: (parent, args) => {
                return teachers.filter(teacher => teacher.id != args.id)
            }
        },
        removeCourse: {
            type: new GraphQLList(CourseType),
            description: 'Remove a Course',
            args: {
                id: {type: new GraphQLNonNull(GraphQLInt)}
            },
            resolve: (parent, args) => {
                return courses.filter(course => course.id != args.id)
            }
        },
        updateTeacher: {
            type: TeacherType,
            description: 'Update a Teacher',
            args:{
                id: {type: new GraphQLNonNull(GraphQLInt)},
                name: {type: new GraphQLNonNull(GraphQLString)},
                post: {type: new GraphQLNonNull(GraphQLString)},
                teaches: {type: new GraphQLNonNull(GraphQLInt)},
            },
            resolve: (parent, args) => {
                const index = teachers.findIndex(teacher => teacher.id === args.id)
                teachers[index] = {
                    id: args.id,
                    name: args.name,
                    post: args.post,
                    teaches: args.teaches
                }
                return teachers[index]
            }
        }
    })
})

const schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType
})

app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true
}))

app.listen(5000., () => console.log('Server is Running'))
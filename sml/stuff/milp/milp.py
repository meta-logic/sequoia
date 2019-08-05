from gurobipy import *
import sys
import os


if len(sys.argv) < 2:
    print "usage: python %s <file>" %sys.argv[0]
    sys.exit()
file = sys.argv[1]


f = open(file,"r")
row_num, var_num, t1_num = map(int,f.readline().split(" "))

def get_model():
    nl = open(os.devnull,'w')
    temp = sys.stdout
    sys.stdout = nl 
    m = Model("test")
    nl.close()
    sys.stdout = temp
    return m

m = get_model()


m.setParam("OutputFlag",0)

rows = [0]*row_num
for i in range(row_num):
	rows[i] = map(int,f.readline().split(" "))

f.close()
# each row : (g,gp,g1p,g2p)

#always square
unifier = [0]*var_num
for i in range(var_num):
	unifier[i] = [0]*var_num

for i in range(t1_num):
	for j in range(var_num):
		unifier[i][j] = m.addVar(vtype=GRB.BINARY,name = 't1, var: %d to %d'%(i,j))
for i in range(t1_num,var_num):
	for j in range(var_num):
		unifier [i][j] = m.addVar(vtype = GRB.INTEGER,lb=0,name = 't2, var: %d to %d'%(i,j))

for i in range(row_num):
	for j in range(var_num):
		expr = LinExpr()
		for var in range(var_num):
			expr +=rows[i][var]*unifier[var][j]
		m.addConstr(expr == 0 ,"row: %d, unifier col %d" %(i,j))
for i in range(t1_num):
	expr = LinExpr()
	for j in range(var_num):
		expr += unifier[i][j]
	m.addConstr(expr>= 1,"t1 var %d not empty" %(i))
m.update()
m.optimize()
print int(m.status != GRB.INFEASIBLE)

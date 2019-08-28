import sys
import os
nl = open(os.devnull,'w')
temp = sys.stdout
sys.stdout = nl 



from mip.model import *
from mip.constants import *




if len(sys.argv) < 2:
    print ("usage: python %s <file> <logfile(optional)>" %sys.argv[0])
    sys.exit()
file = sys.argv[1]

f = open(file,"r")

log = "log.txt"
if len(sys.argv)==3:
    log = sys.argv[2]
w = open(log,"a")

w.write("_________________________________________________\n")

row_num, var_num, t1_num = list(map(int,f.readline().split(" ")))

variables = f.readline().strip().split(" ")
w.write(" ".join(variables)+"\n")
assert(len(variables)==var_num)




def get_model():
    m = Model("test",solver_name=CBC)
    return m

m = get_model()


nl.close()
sys.stdout = temp
m.verbose = 0
#m.setParam("OutputFlag",0)

rows = [0]*row_num
for i in range(row_num):
	rows[i] = list(map(int,f.readline().split(" ")))

f.close()
# each row : (g,gp,g1p,g2p)

#always square
unifier = [0]*var_num
for i in range(var_num):
	unifier[i] = [0]*var_num

for i in range(t1_num):
	for j in range(var_num):
		unifier[i][j] = m.add_var(var_type=BINARY,name = 't1, var: %d to %d'%(i,j))
for i in range(t1_num,var_num):
	for j in range(var_num):
		unifier [i][j] = m.add_var(var_type = INTEGER,lb=0,name = 't2, var: %d to %d'%(i,j))

for i in range(row_num):
	for j in range(var_num):
                m += xsum(rows[i][var]*unifier[var][j] for var in range(var_num))==0
for i in range(t1_num):
        m+= xsum(unifier[i][j] for j in range(var_num)) >= 1

m.emphasis=1
status = m.optimize()

solved = (status == OptimizationStatus.OPTIMAL) or (status == OptimizationStatus.FEASIBLE)

print(int(solved))
w.write(str(solved) + "\n")
if (solved):
	unifier = list(map((lambda x : list(map(lambda y: int(y.x),x))),unifier))
	for i in range(len(unifier)):
		w.write(" ".join(map(str,unifier[i])) +"\n")
